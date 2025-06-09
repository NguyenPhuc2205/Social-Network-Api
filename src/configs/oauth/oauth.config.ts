import { inject, injectable } from 'inversify'
import { DI_TYPES } from '~/core/providers'
import { IConfigService } from '~/configs/config.interface'

export interface IOAuthConfig {
  GOOGLE_OAUTH2_SERVER_ADDRESS?: string
  GOOGLE_OAUTH2_CLIENT_ID?: string
  GOOGLE_OAUTH2_PROJECT_ID?: string
  GOOGLE_OAUTH2_CLIENT_SECRET?: string
  GOOGLE_OAUTH2_REDIRECT_URIS?: string
  GOOGLE_OAUTH2_AUTH_URI: string
  GOOGLE_OAUTH2_TOKEN_URI: string
  GOOGLE_OAUTH2_AUTH_PROVIDER_CERT_URL: string
  GOOGLE_OAUTH2_REFRESH_TOKEN?: string
  getRedirectUrisArray(): string[]
  getGoogleOAuthConfig(): GoogleOAuthConfig
}

export interface GoogleOAuthConfig {
  web: {
    client_id: string
    project_id: string
    auth_uri: string
    token_uri: string
    auth_provider_x509_cert_url: string
    client_secret: string
    redirect_uris: string[]
  }
}

@injectable()
export class OAuthConfig implements IOAuthConfig {
  private _config: IOAuthConfig | null = null

  constructor(
    @inject(DI_TYPES.IConfigService)
    private configService: IConfigService
  ) {}

  private loadConfig(): IOAuthConfig {
    if (!this._config) {
      const validatedConfigs = this.configService.getConfig()

      this._config = {
        GOOGLE_OAUTH2_SERVER_ADDRESS: validatedConfigs.GOOGLE_OAUTH2_SERVER_ADDRESS,
        GOOGLE_OAUTH2_CLIENT_ID: validatedConfigs.GOOGLE_OAUTH2_CLIENT_ID,
        GOOGLE_OAUTH2_PROJECT_ID: validatedConfigs.GOOGLE_OAUTH2_PROJECT_ID,
        GOOGLE_OAUTH2_CLIENT_SECRET: validatedConfigs.GOOGLE_OAUTH2_CLIENT_SECRET,
        GOOGLE_OAUTH2_REDIRECT_URIS: validatedConfigs.GOOGLE_OAUTH2_REDIRECT_URIS,
        GOOGLE_OAUTH2_AUTH_URI: validatedConfigs.GOOGLE_OAUTH2_AUTH_URI,
        GOOGLE_OAUTH2_TOKEN_URI: validatedConfigs.GOOGLE_OAUTH2_TOKEN_URI,
        GOOGLE_OAUTH2_AUTH_PROVIDER_CERT_URL: validatedConfigs.GOOGLE_OAUTH2_AUTH_PROVIDER_CERT_URL,
        GOOGLE_OAUTH2_REFRESH_TOKEN: validatedConfigs.GOOGLE_OAUTH2_REFRESH_TOKEN,
        getRedirectUrisArray: this.getRedirectUrisArray.bind(this),
        getGoogleOAuthConfig: this.getGoogleOAuthConfig.bind(this)
      }
    }

    return this._config
  }

  /** Gets the Google OAuth2 server email address */
  get GOOGLE_OAUTH2_SERVER_ADDRESS(): string | undefined {
    return this.loadConfig().GOOGLE_OAUTH2_SERVER_ADDRESS
  }

  /** Gets the Google OAuth2 client ID */
  get GOOGLE_OAUTH2_CLIENT_ID(): string | undefined {
    return this.loadConfig().GOOGLE_OAUTH2_CLIENT_ID
  }

  /** Gets the Google OAuth2 project ID */
  get GOOGLE_OAUTH2_PROJECT_ID(): string | undefined {
    return this.loadConfig().GOOGLE_OAUTH2_PROJECT_ID
  }

  /** Gets the Google OAuth2 client secret */
  get GOOGLE_OAUTH2_CLIENT_SECRET(): string | undefined {
    return this.loadConfig().GOOGLE_OAUTH2_CLIENT_SECRET
  }

  /** Gets the Google OAuth2 redirect URIs as a comma-separated string */
  get GOOGLE_OAUTH2_REDIRECT_URIS(): string | undefined {
    return this.loadConfig().GOOGLE_OAUTH2_REDIRECT_URIS
  }

  /** Gets the Google OAuth2 authentication URI */
  get GOOGLE_OAUTH2_AUTH_URI(): string {
    return this.loadConfig().GOOGLE_OAUTH2_AUTH_URI
  }

  /** Gets the Google OAuth2 token URI */
  get GOOGLE_OAUTH2_TOKEN_URI(): string {
    return this.loadConfig().GOOGLE_OAUTH2_TOKEN_URI
  }

  /** Gets the Google OAuth2 auth provider certificate URL */
  get GOOGLE_OAUTH2_AUTH_PROVIDER_CERT_URL(): string {
    return this.loadConfig().GOOGLE_OAUTH2_AUTH_PROVIDER_CERT_URL
  }

  /** Gets the Google OAuth2 refresh token */
  get GOOGLE_OAUTH2_REFRESH_TOKEN(): string | undefined {
    return this.loadConfig().GOOGLE_OAUTH2_REFRESH_TOKEN
  }

  /**
   * Converts the comma-separated redirect URIs string to an array
   * @returns Array of redirect URIs
   */
  getRedirectUrisArray(): string[] {
    const uris = this.GOOGLE_OAUTH2_REDIRECT_URIS
    return uris ? uris.split(',').map(uri => uri.trim()) : []
  }

  /**
   * Builds a Google OAuth2 configuration object
   * @returns Complete Google OAuth configuration
   */
  getGoogleOAuthConfig(): GoogleOAuthConfig {
    return {
      web: {
        client_id: this.GOOGLE_OAUTH2_CLIENT_ID || '',
        project_id: this.GOOGLE_OAUTH2_PROJECT_ID || '',
        auth_uri: this.GOOGLE_OAUTH2_AUTH_URI,
        token_uri: this.GOOGLE_OAUTH2_TOKEN_URI,
        auth_provider_x509_cert_url: this.GOOGLE_OAUTH2_AUTH_PROVIDER_CERT_URL,
        client_secret: this.GOOGLE_OAUTH2_CLIENT_SECRET || '',
        redirect_uris: this.getRedirectUrisArray()
      }
    }
  }
}
