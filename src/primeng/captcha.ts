import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  OnDestroy,
  Output,
  PLATFORM_ID,
  ViewChild,
  forwardRef
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

type RecaptchaConfig = {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
  tabindex?: number;
};

type RecaptchaApi = {
  render: (container: HTMLElement, config: RecaptchaConfig) => number;
  reset: (widgetId?: number) => void;
  ready: (cb: () => void) => void;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
    __recaptchaScriptLoadingPromise?: Promise<void>;
  }
}

function loadRecaptchaScript(): Promise<void> {
  if (window.grecaptcha) {
    return Promise.resolve();
  }

  if (window.__recaptchaScriptLoadingPromise) {
    return window.__recaptchaScriptLoadingPromise;
  }

  window.__recaptchaScriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google reCAPTCHA script.'));
    document.head.appendChild(script);
  });

  return window.__recaptchaScriptLoadingPromise;
}

@Component({
  selector: 'p-captcha',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="p-captcha" [class.p-disabled]="disabled"><div #container></div></div>`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Captcha),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => Captcha),
      multi: true
    }
  ]
})
export class Captcha implements AfterViewInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() siteKey = '';
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() size: 'normal' | 'compact' = 'normal';
  @Input() tabindex = 0;
  @Input() required = true;

  @Output() onResponse = new EventEmitter<string>();
  @Output() onExpire = new EventEmitter<void>();
  @Output() onError = new EventEmitter<void>();

  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>;

  private readonly isBrowser: boolean;
  private widgetId: number | null = null;
  private destroyed = false;
  private value: string | null = null;
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};
  disabled = false;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser || !this.siteKey) {
      return;
    }

    await this.renderCaptcha();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  writeValue(value: string | null): void {
    if (!value) {
      this.value = null;
      if (this.isBrowser && this.widgetId !== null && window.grecaptcha) {
        window.grecaptcha.reset(this.widgetId);
      }
      return;
    }

    this.value = value;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(_: AbstractControl): ValidationErrors | null {
    if (!this.required) {
      return null;
    }

    return this.value ? null : { required: true };
  }

  reset(): void {
    this.value = null;
    this.onChange(null);
    this.onTouched();
    if (this.isBrowser && this.widgetId !== null && window.grecaptcha) {
      window.grecaptcha.reset(this.widgetId);
    }
  }

  private async renderCaptcha(): Promise<void> {
    try {
      await loadRecaptchaScript();

      if (this.destroyed || !window.grecaptcha || this.widgetId !== null) {
        return;
      }

      window.grecaptcha.ready(() => {
        if (this.destroyed || this.widgetId !== null) {
          return;
        }

        this.widgetId = window.grecaptcha!.render(this.container.nativeElement, {
          sitekey: this.siteKey,
          callback: (token: string) => {
            this.value = token;
            this.onChange(token);
            this.onTouched();
            this.onResponse.emit(token);
          },
          'expired-callback': () => {
            this.value = null;
            this.onChange(null);
            this.onTouched();
            this.onExpire.emit();
          },
          'error-callback': () => {
            this.value = null;
            this.onChange(null);
            this.onTouched();
            this.onError.emit();
          },
          theme: this.theme,
          size: this.size,
          tabindex: this.tabindex
        });
      });
    } catch {
      this.onError.emit();
    }
  }
}

@NgModule({
  imports: [Captcha],
  exports: [Captcha]
})
export class CaptchaModule {}
