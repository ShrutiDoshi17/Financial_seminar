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

  constructor(private router: Router) { }

  ngOnInit(): void { }

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
    // Stagger each counter slightly
    // So they dont all start at same time
    setTimeout(() => this.countUp('animEvents', 528, 3500), 0);
    setTimeout(() => this.countUp('animProfessionals', 45, 3500), 300);
    setTimeout(() => this.countUp('animParticipants', 1250, 3500), 600);
    setTimeout(() => this.countUp('animSatisfaction', 98, 3500), 900);
  }

  countUp(
    property: 'animEvents' | 'animProfessionals' |
      'animParticipants' | 'animSatisfaction',
    target: number,
    duration: number
  ): void {
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      // How much time has passed as a fraction 0→1
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic — starts fast slows at end
      // Feels like number settling into place
      const eased = 1 - Math.pow(1 - progress, 6);

      // Current display value
      this[property] = Math.round(startValue + (target - startValue) * eased);

      // Keep animating until done
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this[property] = target;
      }
    };

    requestAnimationFrame(animate);
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