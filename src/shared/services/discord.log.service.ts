import { LoggerService } from '@nestjs/common';
import axios from 'axios';

export class DiscordLogger implements LoggerService {
  private webhookUrl = 'https://discord.com/api/webhooks/1376160397979029614/GRDzlWURk8QKMB9DRN5hoYvW5wZcskMLcRJpHTI-a43qsOdFEqBkjhvs3imiTgsQmAVB';

  log(message: string) {
    console.log(message);
    this.sendToDiscord('INFO', message);
  }

  error(message: string, trace?: string) {
    console.error(message, trace);
    this.sendToDiscord('ERROR', `${message}\n${trace || ''}`);
  }

  warn(message: string) {
    console.warn(message);
    this.sendToDiscord('WARN', message);
  }

  debug?(message: string) {
    console.debug(message);
    this.sendToDiscord('DEBUG', message);
  }

  verbose?(message: string) {
    console.info(message);
    this.sendToDiscord('VERBOSE', message);
  }

  private async sendToDiscord(level: string, message: string) {
    try {
      await axios.post(this.webhookUrl, {
        content: `**[${level}]**\n\`\`\`${message}\`\`\``
      });
    } catch (e) {
      // Không log lỗi gửi lên discord để tránh vòng lặp
    }
  }
}