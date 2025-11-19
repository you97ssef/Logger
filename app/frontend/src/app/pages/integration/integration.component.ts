import { Component, inject, OnInit } from '@angular/core';
import {
    LucideAngularModule,
    CodeIcon,
    CopyIcon,
    CheckIcon,
    HomeIcon,
    BookOpenIcon,
    ZapIcon,
} from 'lucide-angular';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

interface CodeExample {
    language: string;
    label: string;
    code: string;
    icon: string;
}

@Component({
    selector: 'app-integration',
    imports: [LucideAngularModule, CommonModule, FormsModule, RouterLink],
    templateUrl: './integration.component.html',
    styleUrl: './integration.component.css',
})
export class IntegrationComponent implements OnInit {
    readonly CodeIcon = CodeIcon;
    readonly CopyIcon = CopyIcon;
    readonly CheckIcon = CheckIcon;
    readonly HomeIcon = HomeIcon;
    readonly BookOpenIcon = BookOpenIcon;
    readonly ZapIcon = ZapIcon;

    private profileService = inject(ProfileService);

    profiles: Profile[] = [];
    selectedProfile: Profile | null = null;
    loading = true;
    copiedIndex: number | null = null;
    apiUrl = environment.api;

    ngOnInit(): void {
        this.loadProfiles();
    }

    loadProfiles(): void {
        this.profileService.getProfiles().subscribe({
            next: (response) => {
                this.profiles = response.data;
                if (this.profiles.length > 0) {
                    this.selectedProfile = this.profiles[0];
                }
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            },
        });
    }

    onProfileChange(profileId: string): void {
        this.selectedProfile =
            this.profiles.find((p) => p.ID === profileId) || null;
    }

    getCodeExamples(): CodeExample[] {
        const token = this.selectedProfile?.Token || 'YOUR_PROFILE_TOKEN_HERE';
        const apiUrl = this.apiUrl;

        return [
            {
                language: 'javascript',
                label: 'JavaScript (Fetch)',
                icon: '📜',
                code: `// Send a log entry using Fetch API
const logToServer = async (message) => {
  try {
    const response = await fetch('${apiUrl}/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: message,
        token: '${token}'
      })
    });
    
    const data = await response.json();
    console.log('Log sent:', data);
  } catch (error) {
    console.error('Error logging:', error);
  }
};

// Usage
logToServer('INFO: Application started');
logToServer('ERROR: Something went wrong');`,
            },
            {
                language: 'typescript',
                label: 'TypeScript (Axios)',
                icon: '💙',
                code: `import axios from 'axios';

interface LogResponse {
  success: boolean;
  data: any;
  message: string;
}

class Logger {
  private readonly apiUrl = '${apiUrl}/log';
  private readonly token = '${token}';

  async log(message: string): Promise<void> {
    try {
      const response = await axios.post<LogResponse>(
        this.apiUrl,
        {
          text: message,
          token: this.token
        }
      );
      console.log('Log sent:', response.data);
    } catch (error) {
      console.error('Error logging:', error);
    }
  }
}

// Usage
const logger = new Logger();
await logger.log('INFO: User logged in');
await logger.log('WARNING: High memory usage');`,
            },
            {
                language: 'python',
                label: 'Python (Requests)',
                icon: '🐍',
                code: `import requests
import json

class Logger:
    def __init__(self):
        self.api_url = '${apiUrl}/log'
        self.token = '${token}'
    
    def log(self, message):
        try:
            payload = {
                'text': message,
                'token': self.token
            }
            response = requests.post(
                self.api_url,
                json=payload,
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            print(f'Log sent: {response.json()}')
        except requests.exceptions.RequestException as e:
            print(f'Error logging: {e}')

# Usage
logger = Logger()
logger.log('INFO: Script started')
logger.log('ERROR: Database connection failed')`,
            },
            {
                language: 'go',
                label: 'Go (net/http)',
                icon: '🔵',
                code: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

type LogRequest struct {
    Text  string \`json:"text"\`
    Token string \`json:"token"\`
}

type Logger struct {
    apiURL string
    token  string
}

func NewLogger() *Logger {
    return &Logger{
        apiURL: "${apiUrl}/log",
        token:  "${token}",
    }
}

func (l *Logger) Log(message string) error {
    logReq := LogRequest{
        Text:  message,
        Token: l.token,
    }
    
    jsonData, err := json.Marshal(logReq)
    if err != nil {
        return fmt.Errorf("error marshaling: %w", err)
    }
    
    resp, err := http.Post(
        l.apiURL,
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    if err != nil {
        return fmt.Errorf("error sending log: %w", err)
    }
    defer resp.Body.Close()
    
    fmt.Println("Log sent successfully")
    return nil
}

// Usage
func main() {
    logger := NewLogger()
    logger.Log("INFO: Application started")
    logger.Log("ERROR: Failed to connect to database")
}`,
            },
            {
                language: 'php',
                label: 'PHP (cURL)',
                icon: '🐘',
                code: `<?php

class Logger {
    private $apiUrl = '${apiUrl}/log';
    private $token = '${token}';
    
    public function log($message) {
        $data = json_encode([
            'text' => $message,
            'token' => $this->token
        ]);
        
        $ch = curl_init($this->apiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data)
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            echo "Log sent: " . $response . "\\n";
        } else {
            echo "Error logging: HTTP $httpCode\\n";
        }
    }
}

// Usage
$logger = new Logger();
$logger->log('INFO: User session started');
$logger->log('WARNING: Cache miss detected');

?>`,
            },
            {
                language: 'java',
                label: 'Java (HttpClient)',
                icon: '☕',
                code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.json.JSONObject;

public class Logger {
    private static final String API_URL = "${apiUrl}/log";
    private static final String TOKEN = "${token}";
    private final HttpClient client;
    
    public Logger() {
        this.client = HttpClient.newHttpClient();
    }
    
    public void log(String message) {
        try {
            JSONObject json = new JSONObject();
            json.put("text", message);
            json.put("token", TOKEN);
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(
                    json.toString()
                ))
                .build();
            
            HttpResponse<String> response = client.send(
                request,
                HttpResponse.BodyHandlers.ofString()
            );
            
            System.out.println("Log sent: " + response.body());
        } catch (Exception e) {
            System.err.println("Error logging: " + e.getMessage());
        }
    }
    
    // Usage
    public static void main(String[] args) {
        Logger logger = new Logger();
        logger.log("INFO: Application started");
        logger.log("ERROR: Null pointer exception");
    }
}`,
            },
            {
                language: 'ruby',
                label: 'Ruby (Net::HTTP)',
                icon: '💎',
                code: `require 'net/http'
require 'json'
require 'uri'

class Logger
  def initialize
    @api_url = '${apiUrl}/log'
    @token = '${token}'
  end
  
  def log(message)
    uri = URI.parse(@api_url)
    header = {'Content-Type': 'application/json'}
    body = {
      text: message,
      token: @token
    }
    
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = (uri.scheme == 'https')
    
    request = Net::HTTP::Post.new(uri.request_uri, header)
    request.body = body.to_json
    
    response = http.request(request)
    puts "Log sent: #{response.body}"
  rescue StandardError => e
    puts "Error logging: #{e.message}"
  end
end

# Usage
logger = Logger.new
logger.log('INFO: Server started')
logger.log('ERROR: Connection timeout')`,
            },
            {
                language: 'csharp',
                label: 'C# (.NET)',
                icon: '#️⃣',
                code: `using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class Logger
{
    private const string ApiUrl = "${apiUrl}/log";
    private const string Token = "${token}";
    private readonly HttpClient _client;
    
    public Logger()
    {
        _client = new HttpClient();
    }
    
    public async Task LogAsync(string message)
    {
        try
        {
            var payload = new
            {
                text = message,
                token = Token
            };
            
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(
                json,
                Encoding.UTF8,
                "application/json"
            );
            
            var response = await _client.PostAsync(ApiUrl, content);
            response.EnsureSuccessStatusCode();
            
            var result = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Log sent: {result}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error logging: {ex.Message}");
        }
    }
}

// Usage
var logger = new Logger();
await logger.LogAsync("INFO: Application started");
await logger.LogAsync("ERROR: Service unavailable");`,
            },
        ];
    }

    copyToClipboard(code: string, index: number): void {
        navigator.clipboard.writeText(code).then(() => {
            this.copiedIndex = index;
            setTimeout(() => {
                this.copiedIndex = null;
            }, 2000);
        });
    }
}
