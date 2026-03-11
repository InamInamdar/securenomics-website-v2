import { Component, Input, OnInit, inject, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="registration-container" [class.bg-white]="step === 1" [class.rounded-3xl]="step === 1" [class.shadow-xl]="step === 1" [class.shadow-blue-500/5]="step === 1" [class.border]="step === 1" [class.border-slate-100]="step === 1" [class.overflow-hidden]="step === 1">
      @if (step === 1) {
        <!-- Header -->
        <div class="px-8 pt-8 pb-6 border-b border-slate-50">
          <h2 class="text-2xl font-black text-slate-900">Registration</h2>
          <p class="text-sm text-slate-500 mt-1 animate__animated animate__fadeIn">Verify your business email to continue.</p>
        </div>

        <form [formGroup]="regForm" class="p-8">
          <div class="animate__animated animate__fadeIn">
            <div class="form-group">
              <label class="form-label">Business Email Address *</label>
              <input 
                type="email" 
                formControlName="businessEmail" 
                class="form-input" 
                [class.border-red-500]="emailError"
                placeholder="e.g. name@company.com"
                (input)="emailError = null"
              >
              <p class="text-[11px] text-slate-400 mt-2 leading-relaxed italic">
                Note: Must be a business email address. Email accounts from domains like gmail, hotmail, yahoo etc. will not be accepted.
              </p>
              @if (emailError) {
                <p class="text-xs text-red-500 mt-1 font-semibold">{{ emailError }}</p>
              }
            </div>

            <div class="mt-8">
              <button 
                type="button" 
                (click)="nextStep()" 
                class="cta-button cta-primary w-full py-4 text-sm relative overflow-hidden"
                [disabled]="regForm.get('businessEmail')?.invalid || isLoading"
              >
                @if (isLoading) {
                  <div class="flex items-center gap-2">
                    <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying...</span>
                  </div>
                } @else {
                  <span>Next</span>
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                }
              </button>
            </div>
          </div>
        </form>
      }

      @if (step === 2) {
        <!-- Full Form Section (Styled as Section Card) -->
        <div class="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-blue-500/5 border border-slate-100 overflow-hidden animate__animated animate__fadeInUp">
          <div class="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
            <h2 class="text-2xl font-black text-slate-900">Registration Details</h2>
            <p class="text-sm text-slate-500 mt-1">Please provide your professional information for the course.</p>
          </div>

          <form [formGroup]="regForm" class="p-8 lg:p-12">
            <div class="space-y-8">
              <!-- Basic Info -->
              <div class="grid md:grid-cols-2 gap-8">
                <div class="form-group">
                  <label class="form-label text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Full Name *</label>
                  <input type="text" formControlName="name" class="form-input" placeholder="Enter your full name">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Company *</label>
                  <input type="text" formControlName="company" class="form-input" placeholder="Company Name">
                </div>
              </div>

              <!-- Professional Details -->
              <div class="grid md:grid-cols-2 gap-8">
                <div class="form-group">
                  <label class="form-label text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Job Title *</label>
                  <input type="text" formControlName="title" class="form-input" placeholder="Your role">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Phone Number *</label>
                  <input type="tel" formControlName="phone" class="form-input" placeholder="Direct workspace phone">
                </div>
              </div>

              <!-- Contact & Payment -->
              <div class="grid md:grid-cols-2 gap-8">
                <div class="form-group">
                  <label class="form-label text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Alternate Email</label>
                  <input type="email" formControlName="alternateEmail" class="form-input" placeholder="Optional backup email">
                </div>
                <div class="form-group">
                  <label class="form-label text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Payment Method</label>
                  <select formControlName="paymentMethod" class="form-input">
                    <option value="Purchase Order">Purchase Order</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
              </div>

              <!-- Comments -->
              <div class="form-group">
                <label class="form-label text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">Additional Comments</label>
                <textarea formControlName="comments" class="form-input min-h-[120px]" placeholder="Any specific requirements or comments?"></textarea>
              </div>

              <!-- Verification -->
              <div class="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                  <div class="w-6 h-6 border-2 border-slate-300 rounded flex items-center justify-center bg-white cursor-pointer hover:border-blue-500 transition-colors">
                  </div>
                  <span class="text-sm font-medium text-slate-600">I'm not a robot</span>
                </div>
                <img src="assets/images/recaptcha.png" alt="reCAPTCHA" class="h-8 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0 cursor-help" onerror="this.style.display='none'">
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-4 pt-6">
                <button 
                  type="button" 
                  (click)="prevStep()" 
                  class="cta-button bg-slate-100 text-slate-600 hover:bg-slate-200 py-5 px-10 text-sm font-bold order-2 sm:order-1"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  (click)="onSubmit()" 
                  class="cta-button cta-primary flex-grow py-5 text-sm font-bold shadow-lg shadow-blue-500/20 order-1 sm:order-2"
                  [disabled]="regForm.invalid || isLoading"
                >
                  @if (isLoading) {
                    <div class="flex items-center gap-2">
                      <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </div>
                  } @else {
                    <span>Confirm Registration</span>
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styleUrl: './registration-form.css'
})
export class RegistrationFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);

  @Input() courseTitle: string = '';
  @Input() step: number = 1;
  @Input() initialEmail: string = '';
  @Input() isLoading: boolean = false;
  @Input() prefillData: any = null;

  @Output() onVerified = new EventEmitter<string>();
  @Output() onBack = new EventEmitter<void>();
  @Output() onSubmitRegistration = new EventEmitter<any>();

  regForm!: FormGroup;
  emailError: string | null = null;

  restrictedDomains = [
    'hotmail.com', 'gmail.com', 'yahoo.com', 'outlook.com', 
    'live.com', 'mail.com', 'cisco.com', 'fortinet.com', 
    'juniper.com', 'juniper.net', 'wiz.io', 'island.io'
  ];

  ngOnInit() {
    this.regForm = this.fb.group({
      businessEmail: [this.initialEmail, [Validators.required, Validators.email]],
      name: ['', Validators.required],
      company: ['', Validators.required],
      title: ['', Validators.required],
      phone: ['', Validators.required],
      alternateEmail: [''],
      paymentMethod: ['Purchase Order'],
      comments: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialEmail'] && this.regForm) {
      this.regForm.get('businessEmail')?.setValue(changes['initialEmail'].currentValue);
    }
    if (changes['prefillData'] && changes['prefillData'].currentValue && this.regForm) {
      const data = changes['prefillData'].currentValue;
      this.regForm.patchValue({
        name: data.name || '',
        company: data.company || '',
        phone: data.mobile_no || ''
      });
    }
  }

  nextStep() {
    const email = this.regForm.get('businessEmail')?.value;
    if (!email) return;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      this.emailError = 'Please enter a valid email address';
      return;
    }

    const domain = email.split('@')[1]?.toLowerCase();
    if (this.restrictedDomains.includes(domain)) {
      this.emailError = 'Sorry, you cannot RSVP to this event with this email';
      return;
    }

    this.emailError = null;
    this.onVerified.emit(email);
  }

  prevStep() {
    this.onBack.emit();
  }

  onSubmit() {
    if (this.regForm.valid) {
      this.onSubmitRegistration.emit(this.regForm.value);
    } else {
      this.markFormGroupTouched(this.regForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
