import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GoogleAuthService } from 'src/services/google-auth.service';


declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'googleAuth';
  processing = false;

  constructor(private googleAuthService: GoogleAuthService) {}

  ngOnInit(): void {
    this.loadGoogleAuthScript()
      .then(() => this.initializeGoogleAuth())
      .catch(error => console.error('Error loading Google Auth script:', error));
  }

  loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Error loading script: ${src}`));

      document.body.appendChild(script);
    });
  }

  loadGoogleAuthScript(): Promise<void> {
    return this.loadScript('https://accounts.google.com/gsi/client');
  }

  initializeGoogleAuth(): void {
    if (typeof window !== 'undefined' && window.google) {
      const config = {
        client_id: environment.google_client_Id,   // client_id can be passed directly as a string instead of env
        callback: this.handleGoogleAuthResponse.bind(this)
      };
      console.log('conf', config);

      window.google.accounts.id.initialize(config);
      this.renderGoogleAuthButton();
    }
  }

  renderGoogleAuthButton(): void {
    const buttonDiv = document.getElementById('buttonDiv');

    if (buttonDiv) {
      window.google.accounts.id.renderButton(buttonDiv, { theme: 'outline', size: 'large' });
    }
  }

  handleGoogleAuthResponse(response: any): void {
    this.processing = true;
    this.googleAuthService.verifyGoogleToken({ id_token: response.credential })
      .subscribe({
        next: (res) => {
          console.log('res', res);
        },
        error: (err) => {
          console.log('err', err);
        },
        complete: () => {
          this.processing = false;
        }
      });
  }
}


// declare global {
//   interface Window {
//     google: any;
//   }
// }
// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent implements OnInit {
//   title = 'googleAuth';
//   processing = false;

//   constructor(private elRef: ElementRef, private renderer: Renderer2, private googleAuthService: GoogleAuthService) {}

//   ngOnInit(): void {
//     const script = this.renderer.createElement('script');
//     script.src = 'https://accounts.google.com/gsi/client';
//     script.async = true;
//     script.defer = true;

//     script.onload = () => {
//       const buttonDiv = this.elRef.nativeElement.querySelector('#buttonDiv');

//       window.google.accounts.id.initialize({
//         client_id: '692061926530-8oqtlb82j9bbjtuujbnurf3u2mqqrvin.apps.googleusercontent.com',
//         callback: (response: any) => this.handleCredentialResponse(response),
//         auto_select: false,
//         cancel_on_tap_outside: true,
//       });

//       window.google.accounts.id.renderButton(buttonDiv, { theme: 'outline', size: 'large' });
//     };

//     this.renderer.appendChild(this.elRef.nativeElement, script);
//   }

//   handleCredentialResponse(response: any) {
//     console.log('resp', response)
//     this.googleAuthService.verifyGoogleToken({ id_token: response.credential })
//       .subscribe({
//         next: (res) => {
//           console.log('res', res);
          
//         },
//         error: (err) => {
//           this.processing= false
//           console.log('err', err)
//         },
//       });
//   }
// }