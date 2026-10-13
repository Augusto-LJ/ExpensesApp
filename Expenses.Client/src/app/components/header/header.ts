import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [RouterLink, AsyncPipe],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  constructor(private authService: AuthService) {

  }

}
