import { Component } from '@angular/core';
import { ModalComponent } from './modal/modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  imports: [ModalComponent],
  template: `
    <main>
      <header>
        <div class="header-content">
          <img src="https://www.pikpng.com/pngl/m/379-3794558_png-file-svg-digital-scale-icon-png-clipart.png" alt="Digital Scale" height="35" width="35">
          <h2 style="padding-left: 10px">Balança</h2>
        </div>
      </header>
      <section>
        <div>
          <button class="btn" (click)="openModal()">Iniciar</button>
        </div>
      </section>
    </main>
  `,
  standalone: true,
  styleUrl: './app.component.css' // Use styleUrls for CSS files
})
export class AppComponent {
  modalRef: NgbModalRef | undefined;

  constructor(private modalService: NgbModal) {}

  openModal() {
    this.modalRef = this.modalService.open(ModalComponent, { centered: true });
  }

}
