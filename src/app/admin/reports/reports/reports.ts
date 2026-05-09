import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { ReportService } from '../../../services/report';
import { ToastService } from '../../../services/toast';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTabsModule
  ],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss']
})
export class Reports implements OnInit, AfterViewInit {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef;
  @ViewChild('leadsChart') leadsChartRef!: ElementRef;
  @ViewChild('applianceChart') applianceChartRef!: ElementRef;
  @ViewChild('paymentChart') paymentChartRef!: ElementRef;

  selectedPeriod = 'month';
  periods = [
    { label: 'Aaj', value: 'today' },
    { label: 'Is Hafte', value: 'week' },
    { label: 'Is Mahine', value: 'month' },
    { label: 'Is Saal', value: 'year' }
  ];

  loading = true;
  chartsLoading = true;
  exportingLeads = false;
  exportingBills = false;
  exportingEngineers = false;

  overview: any = null;
  engineerPerformance: any[] = [];
  serviceBreakdown: any = null;
  revenueData: any[] = [];
  leadsData: any[] = [];

  private charts: any[] = [];

  constructor(
    private reportService: ReportService,
    private toast: ToastService,
       private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  ngAfterViewInit() {}

  loadAll() {
    this.loading = true;
    this.chartsLoading = true;

    // Overview
    this.reportService.getOverview(this.selectedPeriod).subscribe({
      next: (res: any) => {
        this.overview = res.data;
        this.loading = false;
         this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });

    // Charts
    this.reportService.getRevenueChart(this.selectedPeriod).subscribe({
      next: (res: any) => {
        this.revenueData = res.revenueData || [];
        this.leadsData = res.leadsData || [];
        this.chartsLoading = false;
        setTimeout(() => this.drawCharts(), 100);
      },
      error: () => { this.chartsLoading = false; }
    });

    // Engineer Performance
    this.reportService.getEngineerPerformance(this.selectedPeriod).subscribe({
      next: (res: any) => {
        this.engineerPerformance = res.performance || [];
      },
      error: () => {}
    });

    // Service Breakdown
    this.reportService.getServiceBreakdown(this.selectedPeriod).subscribe({
      next: (res: any) => {
        this.serviceBreakdown = res;
        setTimeout(() => this.drawPieCharts(), 200);
      },
      error: () => {}
    });
  }

  onPeriodChange() {
    this.destroyCharts();
    this.loadAll();
  }

  destroyCharts() {
    this.charts.forEach(c => c?.destroy?.());
    this.charts = [];
  }

  drawCharts() {
    if (!this.revenueChartRef) return;
    this.drawRevenueChart();
    this.drawLeadsChart();
  }

  drawRevenueChart() {
    const canvas = this.revenueChartRef?.nativeElement;
    if (!canvas || !this.revenueData.length) return;

    const ctx = canvas.getContext('2d');
    const labels = this.revenueData.map(d => d._id);
    const revenues = this.revenueData.map(d => d.revenue);
    const paid = this.revenueData.map(d => d.paid);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxVal = Math.max(...revenues, 1);
    const chartH = canvas.height - 60;
    const chartW = canvas.width - 60;
    const barW = Math.max(20, (chartW / labels.length) - 12);

    // Grid lines
    ctx.strokeStyle = '#F0F4FF';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = 20 + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(canvas.width - 10, y);
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Plus Jakarta Sans';
      ctx.fillText(`₹${Math.round(maxVal - (maxVal / 5) * i)}`, 2, y + 4);
    }

    labels.forEach((label, i) => {
      const x = 55 + i * (chartW / labels.length);
      const barHeight = (revenues[i] / maxVal) * chartH;
      const paidHeight = (paid[i] / maxVal) * chartH;
      const y = 20 + chartH - barHeight;

      // Total bar
      const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
      grad.addColorStop(0, '#8B5CF6');
      grad.addColorStop(1, '#6366F1');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barHeight, 4);
      ctx.fill();

      // Paid bar overlay
      const paidY = 20 + chartH - paidHeight;
      const paidGrad = ctx.createLinearGradient(0, paidY, 0, paidY + paidHeight);
      paidGrad.addColorStop(0, '#10B981');
      paidGrad.addColorStop(1, '#059669');
      ctx.fillStyle = paidGrad;
      ctx.beginPath();
      ctx.roundRect(x + barW / 4, paidY, barW / 2, paidHeight, 4);
      ctx.fill();

      // Label
      ctx.fillStyle = '#64748B';
      ctx.font = '9px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      const shortLabel = label.length > 7 ? label.slice(5) : label;
      ctx.fillText(shortLabel, x + barW / 2, canvas.height - 8);
      ctx.textAlign = 'left';

      // Value on top
      if (revenues[i] > 0) {
        ctx.fillStyle = '#4F46E5';
        ctx.font = 'bold 9px Plus Jakarta Sans';
        ctx.textAlign = 'center';
        ctx.fillText(`₹${revenues[i]}`, x + barW / 2, y - 4);
        ctx.textAlign = 'left';
      }
    });
  }

  drawLeadsChart() {
    const canvas = this.leadsChartRef?.nativeElement;
    if (!canvas || !this.leadsData.length) return;

    const ctx = canvas.getContext('2d');
    const labels = this.leadsData.map(d => d._id);
    const counts = this.leadsData.map(d => d.count);
    const completed = this.leadsData.map(d => d.completed);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxVal = Math.max(...counts, 1);
    const chartH = canvas.height - 60;
    const chartW = canvas.width - 60;

    // Grid
    ctx.strokeStyle = '#F0F4FF';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = 20 + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(canvas.width - 10, y);
      ctx.stroke();
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Plus Jakarta Sans';
      ctx.fillText(String(Math.round(maxVal - (maxVal / 5) * i)), 2, y + 4);
    }

    // Line chart
    const drawLine = (data: number[], color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';

      data.forEach((val, i) => {
        const x = 55 + i * (chartW / (labels.length - 1 || 1));
        const y = 20 + chartH - (val / maxVal) * chartH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Dots
      data.forEach((val, i) => {
        const x = 55 + i * (chartW / (labels.length - 1 || 1));
        const y = 20 + chartH - (val / maxVal) * chartH;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    drawLine(counts, '#8B5CF6');
    drawLine(completed, '#10B981');

    // Labels
    labels.forEach((label, i) => {
      const x = 55 + i * (chartW / (labels.length - 1 || 1));
      ctx.fillStyle = '#64748B';
      ctx.font = '9px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      const shortLabel = label.length > 7 ? label.slice(5) : label;
      ctx.fillText(shortLabel, x, canvas.height - 8);
    });
    ctx.textAlign = 'left';
  }

  drawPieCharts() {
    if (!this.serviceBreakdown) return;
    this.drawPieChart(
      this.applianceChartRef?.nativeElement,
      this.serviceBreakdown.byAppliance || [],
      ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16']
    );
    this.drawPaymentChart();
  }

  drawPieChart(canvas: any, data: any[], colors: string[]) {
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const total = data.reduce((s, d) => s + d.count, 0);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - 10;
    const r = Math.min(cx, cy) - 30;

    let startAngle = -Math.PI / 2;

    data.forEach((item, i) => {
      const slice = (item.count / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      const midAngle = startAngle + slice / 2;
      const lx = cx + (r * 0.65) * Math.cos(midAngle);
      const ly = cy + (r * 0.65) * Math.sin(midAngle);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px Plus Jakarta Sans';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round((item.count / total) * 100)}%`, lx, ly);

      startAngle += slice;
    });

    // Legend
    let legendY = canvas.height - (data.length * 16);
    data.forEach((item, i) => {
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(10, legendY, 10, 10);
      ctx.fillStyle = '#374151';
      ctx.font = '9px Plus Jakarta Sans';
      ctx.textAlign = 'left';
      ctx.fillText(`${item._id} (${item.count})`, 24, legendY + 9);
      legendY += 16;
    });
  }

  drawPaymentChart() {
    const canvas = this.paymentChartRef?.nativeElement;
    if (!canvas || !this.serviceBreakdown?.byPayment?.length) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const data = this.serviceBreakdown.byPayment;
    const colors: any = { 'Paid': '#10B981', 'Pending': '#F59E0B', 'Partial': '#6366F1' };
    const total = data.reduce((s: number, d: any) => s + d.amount, 0);

    const maxAmt = Math.max(...data.map((d: any) => d.amount), 1);
    const chartW = canvas.width - 120;

    data.forEach((item: any, i: number) => {
      const y = 30 + i * 50;
      const barW = (item.amount / maxAmt) * chartW;

      ctx.fillStyle = '#F0F4FF';
      ctx.beginPath();
      ctx.roundRect(100, y, chartW, 28, 6);
      ctx.fill();

      const grad = ctx.createLinearGradient(100, 0, 100 + barW, 0);
      grad.addColorStop(0, colors[item._id] || '#6366F1');
      grad.addColorStop(1, colors[item._id] + '99' || '#6366F199');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(100, y, barW, 28, 6);
      ctx.fill();

      ctx.fillStyle = '#374151';
      ctx.font = 'bold 11px Plus Jakarta Sans';
      ctx.textAlign = 'right';
      ctx.fillText(item._id, 90, y + 18);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px Plus Jakarta Sans';
      ctx.textAlign = 'left';
      if (barW > 60) {
        ctx.fillText(`₹${item.amount} (${item.count})`, 108, y + 18);
      }

      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round((item.amount / total) * 100)}%`, canvas.width - 5, y + 18);
    });
    ctx.textAlign = 'left';
  }

  exportData(type: string) {
    if (type === 'leads') this.exportingLeads = true;
    else if (type === 'bills') this.exportingBills = true;
    else this.exportingEngineers = true;

    this.reportService.exportReport(type, this.selectedPeriod).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-report-${this.selectedPeriod}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toast.success(`${type} report download ho gaya! ✅`);
        if (type === 'leads') this.exportingLeads = false;
        else if (type === 'bills') this.exportingBills = false;
        else this.exportingEngineers = false;
      },
      error: () => {
        this.toast.error('Export nahi hua');
        this.exportingLeads = false;
        this.exportingBills = false;
        this.exportingEngineers = false;
      }
    });
  }

  getPerformanceColor(rate: number): string {
    if (rate >= 80) return '#10B981';
    if (rate >= 50) return '#F59E0B';
    return '#EF4444';
  }

  getInitials(name: string): string {
    return name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'EN';
  }


  
}