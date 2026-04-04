import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, AfterViewInit {

  // Animated counter values
  animEvents: number = 0;
  animProfessionals: number = 0;
  animParticipants: number = 0;
  animSatisfaction: number = 0;

  // Track if counters already ran
  private countersStarted: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Watch stats section — start counter when scrolled into view
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.countersStarted) {
              this.countersStarted = true;
              this.startLandingCounters();
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(statsSection);
    }
  }

  startLandingCounters(): void {
    this.countUp('animEvents', 500, 2000);
    this.countUp('animProfessionals', 50, 2000);
    this.countUp('animParticipants', 1000, 2000);
    this.countUp('animSatisfaction', 98, 2000);
  }

  countUp(
    property: 'animEvents' | 'animProfessionals' |
              'animParticipants' | 'animSatisfaction',
    target: number,
    duration: number
  ): void {
    const steps = 60;
    const stepTime = duration / steps;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(
        Math.round(increment * step),
        target
      );
      this[property] = current;

      if (step >= steps || current >= target) {
        this[property] = target;
        clearInterval(timer);
      }
    }, stepTime);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  goToRegister(): void {
    this.router.navigateByUrl('/registration');
  }
}