import { Buffer } from "buffer";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";
import { User } from "tweeter-shared";

export interface RegisterView extends AuthenticationView {
  updateImageUrl: (url: string) => void;
  updateImageBytes: (bytes: Uint8Array) => void;
  updateImageFileExtension: (fileExtension: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  public constructor(view: RegisterView) {
    super(view);
  }

  public async handleImageFile(file: File | undefined) {
    if (file) {
      this.view.updateImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );

        this.view.updateImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.updateImageFileExtension(fileExtension);
      }
    } else {
      this.view.updateImageUrl("");
      this.view.updateImageBytes(new Uint8Array());
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
  ) {
    this.doAuthenticationOperation(
      () => {
        return this.service.register(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension,
        );
      },
      (user: User) => {
        this.view.navigate(`/feed/${user.alias}`);
      },
      "register user",
    );
  }
}
