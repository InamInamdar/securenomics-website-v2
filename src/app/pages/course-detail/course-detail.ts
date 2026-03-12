import { Component, OnInit, signal, inject, viewChild, ElementRef, Injector, effect, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { RegistrationFormComponent } from '../../shared/components/registration-form/registration-form';
import { CourseDetailService } from './course-detail.service';
import { finalize, distinctUntilChanged, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
    private injector = inject(Injector);
    private platformId = inject(PLATFORM_ID);
    private courseId = toSignal(
        this.route.paramMap.pipe(
            map((params) => params.get('id')),
            distinctUntilChanged()
        ),
        { initialValue: this.route.snapshot.paramMap.get('id') }
    );
    schedule = signal<any>(null);
    loading = signal(true);
    error = signal<string | null>(null);

    // Registration state
    registrationStep = signal(1);
    verifiedEmail = '';
    isRegistering = signal(false);
    isRegisteredUser = signal(false);
    showSuccess = signal(false);
    private lastCheckedEmail = '';
    private pendingProceedEmail: string | null = null;
    existingUser: any = null;
    userRole: string = '';
    userId: number | null = null;

    registrationSection = viewChild<ElementRef>('registrationSection');

    ngOnInit(): void {
        effect((onCleanup) => {
            const id = this.courseId() || '';

            if (!id) {
                this.schedule.set(null);
                this.error.set('Invalid course ID.');
                this.loading.set(false);
                return;
            }

            this.loading.set(true);
            this.error.set(null);

            const sub = this.courseDetailService.getScheduleById(id).pipe(
                finalize(() => this.loading.set(false))
            ).subscribe({
                next: (data) => this.schedule.set(data),
                error: () => {
                    this.schedule.set(null);
                    this.error.set('Failed to load course details. Please try again later.');
                }
            });
            onCleanup(() => sub.unsubscribe());
        }, { injector: this.injector });
    }

    handleEmailCheck(email: string, proceedToStep2: boolean = false) {
        const normalizedEmail = (email || '').trim().toLowerCase();
        if (!normalizedEmail) return;

        // Reuse the latest result and avoid duplicate API calls.
        if (this.lastCheckedEmail === normalizedEmail) {
            if (proceedToStep2) {
                this.verifiedEmail = normalizedEmail;
                this.registrationStep.set(2);
                this.scrollToRegistrationSection();
            }
            return;
        }

        if (this.isRegistering()) {
            if (proceedToStep2) {
                this.pendingProceedEmail = normalizedEmail;
            }
            return;
        }

        this.isRegistering.set(true);
        this.courseDetailService.getUserByEmail(normalizedEmail).pipe(
            finalize(() => {
                this.isRegistering.set(false);
                this.lastCheckedEmail = normalizedEmail;
            })
        ).subscribe({
            next: (response) => {
                const candidate = response?.user ?? response?.data?.user ?? response?.data ?? response;
                const user = Array.isArray(candidate) ? candidate[0] : candidate;
                const isExisting = !!(user && (user.id || user.email || user.role));

                this.isRegisteredUser.set(isExisting);
                this.existingUser = isExisting ? user : null;
                this.userId = isExisting && user?.id ? user.id : null;
                this.userRole = isExisting && user?.role ? String(user.role) : '';

                if (proceedToStep2 || this.pendingProceedEmail === normalizedEmail) {
                    this.verifiedEmail = normalizedEmail;
                    this.registrationStep.set(2);
                    this.scrollToRegistrationSection();
                    this.pendingProceedEmail = null;
                }
            },
            error: () => {
                // Email not found or API error path: keep full form flow.
                this.isRegisteredUser.set(false);
                this.existingUser = null;
                this.userId = null;
                this.userRole = '';

                if (proceedToStep2 || this.pendingProceedEmail === normalizedEmail) {
                    this.verifiedEmail = normalizedEmail;
                    this.registrationStep.set(2);
                    this.scrollToRegistrationSection();
                    this.pendingProceedEmail = null;
                }
            }
        });
    }

    // Backward compatibility for any stale template/runtime cache still emitting onVerified -> handleVerified.
    handleVerified(email: string) {
        this.handleEmailCheck(email, true);
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
                this.showSuccess.set(true);
                this.toggleBodyScroll(true);
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

    private scrollToRegistrationSection() {
        setTimeout(() => {
            const element = this.registrationSection()?.nativeElement;
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    @HostListener('document:keydown.escape', ['$event'])
    onEscapeKey(event: any) {
        if (this.showSuccess()) {
            this.closeModal();
        }
    }

    closeModal() {
        this.showSuccess.set(false);
        this.toggleBodyScroll(false);
    }

    onBackToCourseList() {
        this.closeModal();
        this.router.navigate(['/learn']);
    }

    private toggleBodyScroll(disable: boolean) {
        if (isPlatformBrowser(this.platformId)) {
            if (disable) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
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

