import { Injectable } from '@nestjs/common';
import {
  IYoutubeSearchItem,
  IYoutubeVideoItem,
  IYoutubeVideoResult,
  IYoutubeVideoSnippet,
  IYoutubeContentDetails,
  IYoutubeStatistics,
  IYoutubeSearchResult,
  IYoutubeSearchSnippet,
} from '@youtube/common-ui';
import { catchError, EMPTY, forkJoin, from, map, Observable, of } from 'rxjs';
import * as yts from 'youtube-sr';

@Injectable()
export class YoutubeApiServiceV2 {
  public searchList(query: string): Observable<IYoutubeSearchResult> {
    return from(yts.default.search(query)).pipe(
      catchError(() => {
        return EMPTY;
      }),
      map((res) => this.mapToYoutubeSearchResult(res))
    );
  }

  public videoList(id: string): Observable<IYoutubeVideoResult[]> {
    if (!id) {
      return of([]);
    }
    const transformedId = id.split(',');
    const requests: Observable<IYoutubeVideoResult>[] = transformedId.map((query) => this.getVideoListRequest(query));
    return forkJoin(requests).pipe(map((result: IYoutubeVideoResult[]) => result.filter(Boolean)));
  }

  private getVideoListRequest(id: string): Observable<IYoutubeVideoResult> {
    const query = `https://www.youtube.com/watch?v=${id}`;
    return from(yts.default.getVideo(query)).pipe(
      catchError(() => of(null)),
      map((res) => this.mapToYoutubeVideoResult(res))
    );
  }

  private mapToYoutubeSearchResult(results): IYoutubeSearchResult {
    return {
      kind: null,
      etag: null,
      nextPageToken: results?.nextPageToken,
      regionCode: null,
      pageInfo: null,
      items: this.mapToYoutubeSearchItem(results),
    };
  }

  private mapToYoutubeSearchItem(results): IYoutubeSearchItem[] {
    return results?.map((result) => {
      return {
        kind: null,
        etag: null,
        id: {
          videoId: result?.id,
        },
        snippet: this.mapToYoutubeSearchSnippet(result),
      };
    });
  }

  private mapToYoutubeSearchSnippet(result): IYoutubeSearchSnippet {
    const defaultThumbnail = result?.thumbnail;

    return {
      publishedAt: result?.uploadedAt,
      channelId: result?.channel?.id,
      title: result?.title,
      description: result?.title,
      thumbnails: {
        default: defaultThumbnail,
        medium: defaultThumbnail,
        high: defaultThumbnail,
      },
      channelTitle: result?.channel?.name,
      liveBroadcastContent: null,
      publishTime: null,
    };
  }

  private mapToYoutubeVideoResult(result): IYoutubeVideoResult {
    const resultClone = JSON.parse(JSON.stringify(result));
    return {
      kind: null,
      etag: null,
      pageInfo: {
        totalResults: 1,
        resultsPerPage: 1,
      },
      items: this.mapToYoutubeVideoItem(resultClone),
    };
  }

  private mapToYoutubeVideoItem(result): IYoutubeVideoItem[] {
    const resultClone = JSON.parse(JSON.stringify(result));
    return [
      {
        kind: null,
        etag: null,
        id: result?.id,
        snippet: this.mapToYoutubeVideoSnippet(resultClone),
        contentDetails: this.mapToYoutubeVideoContent(resultClone),
        statistics: this.mapToYoutubeVideoStatistics(resultClone),
      },
    ];
  }

  private mapToYoutubeVideoSnippet(result): IYoutubeVideoSnippet {
    const defaultThumbnail = result?.thumbnail;

    return {
      publishedAt: result?.uploadedAt,
      channelId: result?.channel?.id,
      title: result?.title,
      description: result?.description,
      thumbnails: {
        default: defaultThumbnail,
        medium: defaultThumbnail,
        high: defaultThumbnail,
        standard: defaultThumbnail,
        maxres: defaultThumbnail,
      },
      channelTitle: result?.channel?.name,
      tags: result?.tags,
      categoryId: null,
      liveBroadcastContent: null,
      localized: null,
    };
  }

  private mapToYoutubeVideoContent(result): IYoutubeContentDetails {
    return {
      duration: result?.duration_formatted,
      dimension: null,
      definition: null,
      caption: null,
      licensedContent: null,
      contentRating: null,
      projection: null,
    };
  }

  private mapToYoutubeVideoStatistics(result): IYoutubeStatistics {
    return {
      viewCount: result?.views,
      likeCount: result?.ratings?.likes,
      favoriteCount: null,
      commentCount: null,
    };
  }
}