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
import { SEARCHLIST_MOCK } from '../../../../shell/src/mocks/searchlist';
import { VIDEOLIST_MOCK } from '../../../../shell/src/mocks/videolist';

@Injectable()
export class YoutubeApiServiceV2 {
  searchList(query: string): Observable<IYoutubeSearchResult> {
    const searchListItems = SEARCHLIST_MOCK.items.map((result) => ({
      kind: result.kind,
      etag: result.etag,
      id: result.id,
      snippet: {
        ...result.snippet,
        publishedAt: new Date('2017-01-11T00:00:00Z'),
      },
    }));
  
    return of({
      kind: SEARCHLIST_MOCK.kind,
      etag: SEARCHLIST_MOCK.etag,
      regionCode: SEARCHLIST_MOCK.regionCode,
      pageInfo: SEARCHLIST_MOCK.pageInfo,
      items: searchListItems,
    });
  }

  videoList(videoIds: string[]): Observable<IYoutubeVideoResult[]> {
    const result: IYoutubeVideoResult[] = VIDEOLIST_MOCK.map((entry) => ({
      ...entry,
      items: entry.items.map((item) => ({
        ...item,
        snippet: {
          ...item.snippet,
          publishedAt: new Date(item.snippet.publishedAt),
        },
        statistics: {
          ...item.statistics,
          likeCount: String(item.statistics.likeCount),
          favoriteCount: String(item.statistics.favoriteCount),
          commentCount: String(item.statistics.commentCount),
        },
      })),
    }));
  
    return of(result);
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
