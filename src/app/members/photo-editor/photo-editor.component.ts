import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  // we bring something from the parent component
  @Input() photos: Photo[];

  // Update the parent component from the child component
  // EventEmitter because output prop emits an event
  // We emit a string because we emit the photo url
  // There are 4 stages of output
  // 1) declare output, 2) emit the event
  // 3) parent component template. Use parenthessis with the output declaration and assign a method which is inside the parent component
  // And we pass in $event, which contains the data
  // 4) Create the method from above in the parent component.
  @Output() getMemberPhotoChange = new EventEmitter<string>();

  baseUrl = environment.apiUrl;

  hasBaseDropZoneOver: boolean;
  uploader: FileUploader;
  response: string;
  currentMain: Photo;
  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private userService: UserService
  ) {
    this.hasBaseDropZoneOver = false;
  }

  ngOnInit() {
    // Init uploader
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        'users/' +
        this.authService.decodedToken.nameid +
        '/photos', // we need the user id
      authToken: 'Bearer ' + localStorage.getItem('token'), // we need to pass the token
      allowedMimeType: ['image/jpeg', 'images', 'png', 'jpg'],
      maxFileSize: 10 * 1024 * 1024, // it will make the maximum file size of 10mbs
      autoUpload: false, // click a button in order to send this up
      removeAfterUpload: true // after the photo is being uploaded we want to remove it from the upload queue
    });

    this.hasBaseDropZoneOver = false;

    this.response = '';

    this.uploader.response.subscribe(res => (this.response = res));

    // Extend our uploader so that we say that our upload doesn`t go with credentials
    // This will pass the CORS error
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };

    this.uploader.onWhenAddingFileFailed = fileNotSupported => {
      this.alertify.error('The file you are trying to upload is not an image');
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      console.log('on success item');
      if (response) {
        const res: Photo = JSON.parse(response); // convert string to an obj, because our photo is an object

        // We build up a photo from the response of the server
        const photo = {
          id: res.id,
          url: res.url,
          dateadded: res.dateadded,
          description: res.description,
          isMain: res.isMain
        };
        // possible break for isMain
        this.photos.push(photo);
        if (photo.isMain) {
          // First time the user uploads a photo, it will be set as main photo
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }
      }
      this.alertify.success('photo uploaded');
    };
  }

  // We subscribe to the services when we use them in other components.
  // If we set the current photo to is main false and the newest current to true
  // this is how we reflect the new main photo straight away in the browser.
  setMainPhoto(photo: Photo) {
    this.userService
      .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(
        () => {
          // We use the array filter method to filter the photos apart from the main photo
          // Filter returns a copy of the photos array. Filters out anything that it doesn`t match in the p
          this.currentMain = this.photos.filter(p => p.isMain === true)[0];
          if (this.currentMain) {
            this.currentMain.isMain = false;
            photo.isMain = true;
            this.authService.changeMemberPhoto(photo.url);
            // we set the new url for the user in authService
            this.authService.currentUser.photoUrl = photo.url;

            // Then in local storage we are going to override the current url in the local storage
            localStorage.setItem(
              'user',
              JSON.stringify(this.authService.currentUser)
            );
            this.alertify.success('Successfully set to profile picture');
          }
        },
        error => {
          this.alertify.error('Photo could not be set as profile picture');
        }
      );
  }

  // Id represents the photo id
  deletePhoto(id: number) {
    this.alertify.confirm('You want to delete this photo?', () => {
      this.userService
        .deletePhoto(this.authService.decodedToken.nameid, id)
        .subscribe(() => {
          // remove the photos from the photos array
          // Splice removes elements from an array
          this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
          this.alertify.success('Photo has been deleted');
        }, error => {
          this.alertify.error('Failed to delete the photo');
        });
    });
  }
}
