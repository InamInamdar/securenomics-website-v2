import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';
import { Subscription } from 'rxjs';
import { DemoRequestService } from './demo-request.service';

@Component({
  selector: 'app-demo-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    Header,
    Footer,
    AnimateOnScrollDirective
  ],
  templateUrl: './demo-request.html',
  styleUrl: './demo-request.css',
  providers: [DemoRequestService]
})
export class DemoRequestComponent implements OnInit, OnDestroy {
  demoForm: FormGroup;
  private otherCheckboxSub!: Subscription;

  topics = [
    { id: 'sse', label: 'SSE' },
    { id: 'zero-trust', label: 'Zero Trust' },
    { id: 'web-cloud-security', label: 'Web & Cloud Security' },
    { id: 'securing-remote-workers', label: 'Securing Remote Workers' },
    { id: 'network-transformation', label: 'Network Transformation' },
    { id: 'data-protection', label: 'Data Protection' },
    { id: 'threat-protection', label: 'Threat Protection' },
    { id: 'ransomware-protection', label: 'Ransomware Protection' },
    { id: 'threat-intelligence', label: 'Threat Intelligence' },
    { id: 'analytics-insights', label: 'Analytics and Insights' },
    { id: 'other', label: 'Other (please specify)' }
  ];

  constructor(
    private fb: FormBuilder,
    private demoService: DemoRequestService,
    private router: Router
  ) {
    this.demoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      company: ['', Validators.required],
      jobTitle: ['', Validators.required],
      businessEmail: ['', [Validators.required, Validators.email]],
      employeeCount: ['', Validators.required],
      country: ['', Validators.required],
      topicsArray: this.fb.array(
        this.topics.map(() => new FormControl(false)),
        [this.atLeastOneTopicSelectedValidator()]
      ),
      otherTopicDescription: ['']
    });
  }

  ngOnInit() {
    const otherIndex = this.topics.findIndex(t => t.id === 'other');
    if (otherIndex !== -1) {
      const otherControl = (this.demoForm.get('topicsArray') as FormArray).at(otherIndex);
      this.otherCheckboxSub = otherControl.valueChanges.subscribe((isChecked: boolean) => {
        const otherDescControl = this.demoForm.get('otherTopicDescription');
        if (isChecked) {
          otherDescControl?.setValidators([Validators.required]);
        } else {
          otherDescControl?.clearValidators();
          otherDescControl?.setValue('');
        }
        otherDescControl?.updateValueAndValidity();
      });
    }
  }

  ngOnDestroy() {
    if (this.otherCheckboxSub) {
      this.otherCheckboxSub.unsubscribe();
    }
  }

  get isOtherSelected(): boolean {
    const otherIndex = this.topics.findIndex(t => t.id === 'other');
    return otherIndex !== -1 ? (this.demoForm.get('topicsArray') as FormArray).at(otherIndex).value : false;
  }

  onSubmit() {
    if (this.demoForm.valid) {
      const formValue = this.demoForm.value;

      // Extract selected topic labels
      const selectedTopicLabels = this.topics
        .filter((_, i) => formValue.topicsArray[i])
        .map(t => t.label);

      // Check if "Other" is selected
      const otherTopic = this.topics.find(t => t.id === 'other');
      const isOtherSelected = otherTopic
        ? formValue.topicsArray[this.topics.indexOf(otherTopic)]
        : false;

      const payload = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        company: formValue.company,
        jobTitle: formValue.jobTitle,
        contactEmail: formValue.businessEmail,
        country: formValue.country,
        numberOfEmployees: formValue.employeeCount,
        topicOfInterest: selectedTopicLabels.join(', '),
        otherTopicOfInterest: isOtherSelected ? `others:${formValue.otherTopicDescription || ''}` : ''
      };

      this.demoService.getDemoData(payload).subscribe({
        next: () => {
          alert('Demo Request submitted successfully!');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error submitting Demo Request', error);
          alert('Failed to submit Demo Request. Please try again.');
        }
      });
    } else {
      this.markFormGroupTouched(this.demoForm);
    }
  }

  private atLeastOneTopicSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const topicsArray = control as FormArray;
      const hasSelection = topicsArray.controls.some(topic => topic.value === true);
      return hasSelection ? null : { required: true };
    };
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
      if (control instanceof FormArray) {
        control.controls.forEach(c => this.markFormGroupTouched(c as FormGroup));
      }
    });
  }
}
