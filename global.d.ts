declare module "octokit-next" {
  type RequestOptions = {
    [key: string]: unknown;
  };

  type OctokitResponse<T = unknown> = {
    data: T;
  };

  export class Octokit {
    constructor(options?: { auth?: string; request?: { fetch?: typeof fetch } });

    request<T = unknown>(
      route: string,
      parameters?: RequestOptions,
    ): Promise<OctokitResponse<T>>;
  }
}


