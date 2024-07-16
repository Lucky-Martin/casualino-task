import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-initial-screen',
  standalone: true,
  imports: [],
  templateUrl: './initial-screen.component.html',
  styleUrl: './initial-screen.component.scss'
})
export class InitialScreenComponent {
  constructor(private router: Router) {
  }

  async onNavigate(route: string) {
    await this.router.navigate(['auth', route]);
  }
}
