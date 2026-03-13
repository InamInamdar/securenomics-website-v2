import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-pov-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    Header,
    Footer,
    AnimateOnScrollDirective
  ],
  templateUrl: './pov-request.html',
  styleUrl: './pov-request.css'
})
export class PovRequestComponent {
  povForm: FormGroup;

  features = [
    {
      title: 'NG-SWG Standard, Professional & Enterprise version',
      icon: 'pi pi-shield',
      description: 'Next-Generation Secure Web Gateway for comprehensive web security.'
    },
    {
      title: 'Remote Browser Isolation',
      icon: 'pi pi-desktop',
      description: 'Air-gap your web browsing to prevent malware from reaching endpoints.'
    },
    {
      title: 'Cloud Firewall',
      icon: 'pi pi-lock',
      description: 'Granular control and visibility for all outbound traffic across ports.'
    },
    {
      title: 'NPA',
      icon: 'pi pi-cloud',
      description: 'Netskope Private Access for secure, zero-trust access to private apps.'
    }
  ];

  timelineSteps = [
    {
      number: '01',
      title: 'POV Preparation Meeting',
      description: 'POV Prep discussion, success criteria discussion, tenant request to be submitted.'
    },
    {
      number: '02',
      title: 'POV Kickoff Meeting',
      description: 'POV Kick off. Schedule weekly cadence (twice if needed).'
    },
    {
      number: '03',
      title: 'Weekly Progress Discussions',
      description: 'Meet once weekly (twice if needed) to discuss POV progress, success criteria progress, and open questions.'
    },
    {
      number: '04',
      title: 'Final Review',
      description: 'After 14 days we will conclude POV and confirm success criteria has been met.'
    }
  ];

  useCases = [
    { id: 'web-traffic', label: 'Complete control over Web Traffic' },
    { id: 'device-posture', label: 'Device posture checking to prevent access to core cloud applications.' },
    { id: 'vpn-compat', label: 'VPN Third-party compatibility with Netskope' },
    { id: 'shadow-it', label: 'Control the shadow-IT' },
    { id: 'ueba', label: 'Anomalies detection of Users (UEBA)' },
    { id: 'cloud-phishing', label: 'Cloud phishing protection' },
    { id: 'risky-web', label: 'Protect users from risky web traffic transparently.' },
    { id: 'all-traffic', label: 'Protect all user traffic from anywhere/any device - Block risky non-web traffic to C&C' },
    { id: 'vpn-replace', label: 'Replacement of remote access VPN' },
    { id: 'clientless-access', label: 'Third-party/BYOD clientless access to your private applications' },
    { id: 'malware-prev', label: 'Malware and ransomware prevention (standard)' },
    { id: 'data-exfil-post', label: 'Control and block data exfiltration from posting confidential data (DLP)' },
    { id: 'saas-awareness', label: 'Cloud SAAS instance awareness capabilities (DLP)' },
    { id: 'data-movement', label: 'Stop unintentional or unapproved data movement (DLP)' },
    { id: 'data-exfil-screenshot', label: 'Control and block data exfiltration from uploading a screenshot of confidential data (DLP)' },
    { id: 'other', label: 'Other (Please specify any special use case you are looking for)' }
  ];

  constructor(private fb: FormBuilder) {
    this.povForm = this.fb.group({
      name: ['', [Validators.required, this.requiredTrimmedValidator()]],
      company: ['', [Validators.required, this.requiredTrimmedValidator()]],
      phone: ['', [Validators.required, this.requiredTrimmedValidator()]],
      jobTitle: ['', [Validators.required, this.requiredTrimmedValidator()]],
      businessEmail: ['', [Validators.required, Validators.email]],
      employeeCount: ['', Validators.required],
      projectCompletionDate: ['', Validators.required],
      successCriteria: [''],
      useCases: this.fb.array([]),
      comments: ['']
    });
  }

  onSubmit() {
    if (this.povForm.valid) {
      console.log('Form Submitted', this.povForm.value);
    } else {
      this.markFormGroupTouched(this.povForm);
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

  private requiredTrimmedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (typeof value === 'string' && value.trim().length === 0) {
        return { required: true };
      }
      return null;
    };
  }
}
