import { Component, OnInit, signal, inject, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { RegistrationFormComponent } from '../../shared/components/registration-form/registration-form';
import { CourseDetailService } from './course-detail.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-course-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, Header, Footer, RegistrationFormComponent],
    templateUrl: './course-detail.html',
    styleUrl: './course-detail.css'
})
export class CourseDetailComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private sanitizer = inject(DomSanitizer);
    private courseDetailService = inject(CourseDetailService);

    schedule = signal<any>(null);
    loading = signal(true);
    error = signal<string | null>(null);

    // Registration state
    registrationStep = signal(1);
    verifiedEmail = '';
    isRegistering = signal(false);
    existingUser: any = null;
    userRole: string = '';
    userId: number | null = null;

    registrationSection = viewChild<ElementRef>('registrationSection');

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id') || '';
        if (!id) {
            this.error.set('Invalid course ID.');
            this.loading.set(false);
            return;
        }
        else {
            this.courseDetailService.getScheduleById(id).pipe(
                finalize(() => this.loading.set(false))
            ).subscribe({
                next: (data) => this.schedule.set(data),
                error: () => this.error.set('Failed to load course details. Please try again later.')
            });
        }
    }

    handleVerified(email: string) {
        if (this.isRegistering()) return;

        this.isRegistering.set(true);
        this.courseDetailService.getUserByEmail(email).pipe(
            finalize(() => this.isRegistering.set(false))
        ).subscribe({
            next: (response) => {
                const user = response?.user;
                const role = user?.role;

                if (role === 'Admin' || role === 'Instructor') {
                    alert('Email exists as Admin/Instructor. Please use a different email or contact support.');
                    return;
                }

                if (role === 'Student') {
                    // Existing Student logic
                    this.existingUser = user;
                    this.userId = user.id;
                    this.userRole = role;
                    this.verifiedEmail = email;
                    this.registrationStep.set(2);
                } else {
                    // New User or other logic
                    this.existingUser = null;
                    this.userId = null;
                    this.userRole = '';
                    this.verifiedEmail = email;
                    this.registrationStep.set(2);
                }

                // Scroll to the registration section after it's rendered
                setTimeout(() => {
                    const element = this.registrationSection()?.nativeElement;
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            },
            error: () => {
                // If 404 or other error, treat as new user as per typical flow
                this.existingUser = null;
                this.userId = null;
                this.userRole = '';
                this.verifiedEmail = email;
                this.registrationStep.set(2);

                setTimeout(() => {
                    const element = this.registrationSection()?.nativeElement;
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        });
    }

    onSubmitRegistration(register: any) {
        if (this.isRegistering()) return;

        this.isRegistering.set(true);
        const sched = this.schedule();

        let paymentMethodValue = register.paymentMethod || "";
        const trainingType = sched?.course?.category?.training_type || sched?.course?.category?.trainingType;
        if (trainingType === "Certification") {
            if (paymentMethodValue === "Purchase Order") {
                paymentMethodValue = "PURCHASE_ORDER";
            } else if (paymentMethodValue === "Credit Card") {
                paymentMethodValue = "CREDIT_CARD";
            }
        }

        let apiCall;
        if (this.existingUser && this.userId) {
            // Case 2: Existing Student - Update registration
            const updatePayload = {
                email: this.verifiedEmail,
                voucherCode: register.voucher_code || "",
                payForAttendance: paymentMethodValue,
                name: register.name,
                city: this.existingUser.city || "",
                mobileNo: register.phone,
                company: register.company,
                zipCode: this.existingUser.zipCode || "",
                country: this.existingUser.country || "",
                promotionCode: this.existingUser.promotionCode || "",
                additionalComments: register.comments || "",
                alternativeEmailId: register.alternateEmail || "",
                autoEnrollStudent: sched.auto_enroll_student || sched.autoEnrollStudent || false,
                courseScheduleId: sched.id,
                fromWhere: "Netskope",
            };
            apiCall = this.courseDetailService.updateUser(updatePayload, this.userId);
        } else {
            // Case 3: New User - Register
            const registerPayload = {
                email: this.verifiedEmail,
                voucherCode: register.voucher_code || "",
                payForAttendance: paymentMethodValue,
                name: register.name,
                city: "",
                mobileNo: register.phone,
                company: register.company,
                alternativeEmailId: register.alternateEmail || "",
                jobTitle: register.title,
                autoEnrollStudent: sched.auto_enroll_student || sched.autoEnrollStudent || false,
                zipCode: "",
                country: "",
                promotionCode: "",
                additionalComments: register.comments || "",
                isAuth: false,
                courseScheduleId: sched.id,
                organizationId: sched?.course?.category?.organization_id || sched?.course?.category?.organizationId || sched?.course?.organization_id,
                fromWhere: "Netskope",
            };
            apiCall = this.courseDetailService.registerUser(registerPayload);
        }

        apiCall.pipe(
            finalize(() => this.isRegistering.set(false))
        ).subscribe({
            next: () => {
                this.router.navigate(['/confirmation']);
            },
            error: (err) => {
                console.error('Registration error:', err);
                alert('Error While Registration. Please try again.');
            }
        });
    }

    handleBack() {
        this.registrationStep.set(1);
    }

    get safeDescription(): SafeHtml {
        const desc = this.schedule()?.course?.description || '';
        return this.sanitizer.bypassSecurityTrustHtml(desc);
    }

    formatDate(dateString: string, timezone?: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const tz = timezone || 'America/New_York';
        try {
            return new Intl.DateTimeFormat('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZone: tz,
                timeZoneName: 'short'
            }).format(date);
        } catch {
            return date.toLocaleString();
        }
    }

    getStatusClass(status: string): string {
        switch ((status || '').toLowerCase()) {
            case 'confirmed': return 'status-confirmed';
            case 'pending': return 'status-pending';
            case 'cancelled': return 'status-cancelled';
            default: return 'status-default';
        }
    }

    mapRegion(code: string): string {
        const mapping: Record<string, string> = {
            NAM: 'North America',
            EMEA: 'Europe / Middle East / Africa',
            APAC: 'Asia Pacific',
            Global: 'Global'
        };
        return mapping[code] || code;
    }
}

