import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IAppConfig,
  IYoutubeSearchParams,
  IYoutubeSearchResult,
  IYoutubeService,
  IYoutubeVideoListParams,
  IYoutubeVideoResult,
} from '../../models';
import { APP_CONFIG } from '../../tokens';
import { of } from 'rxjs';
import { SEARCHLIST_MOCK } from '../../../mocks/searchlist';
import { VIDEOLIST_MOCK } from '../../../mocks/videolist';

@Injectable({ providedIn: 'root' })
export class YoutubeServiceV2 implements IYoutubeService {
  constructor(@Inject(APP_CONFIG) private readonly appConfig: IAppConfig, private http: HttpClient) {}


  public searchList(params: IYoutubeSearchParams): Observable<IYoutubeSearchResult> {
    const { query } = params;

    const searchListItems = SEARCHLIST_MOCK.items.filter(item => {
      const id = typeof item.id === 'string' ? item.id : item.id?.videoId;
      const title = item.snippet?.title?.toLowerCase() || '';
      const description = item.snippet?.description?.toLowerCase() || '';

      return id === query ||
             title.includes(query.toLowerCase()) ||
             description.includes(query.toLowerCase());
    });


    return of({
      kind: undefined,
      etag: undefined,
      regionCode: undefined,
      pageInfo: undefined,
      items: searchListItems.map(item => ({
        kind: undefined,
        etag: undefined,
        id: item.id,
        snippet: {
          publishedAt: new Date(item.snippet.publishedAt),
          channelId: item.snippet.channelId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnails: item.snippet.thumbnails,
          channelTitle: item.snippet.channelTitle,
          liveBroadcastContent: undefined,
          publishTime: undefined,
        },
      })),
    });

  }


  public videoList(params: IYoutubeVideoListParams): Observable<IYoutubeVideoResult[]> {
    const { id } = params;

    const matchedResults: IYoutubeVideoResult[] = [];

    for (const result of VIDEOLIST_MOCK) {
      const matchedItems = result.items
        .filter(item => item.id === id)
        .map(item => ({
          kind: item.kind ?? '',
          etag: item.etag ?? '',
          id: item.id,
          snippet: item.snippet
            ? {
                publishedAt: new Date(item.snippet.publishedAt),
                channelId: item.snippet.channelId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnails: item.snippet.thumbnails,
                channelTitle: item.snippet.channelTitle,
                tags: item.snippet.tags,
                categoryId: item.snippet.categoryId ?? '',
                liveBroadcastContent: item.snippet.liveBroadcastContent ?? '',
                localized: {
                  title: item.snippet.title,
                  description: item.snippet.description,
                }
              }
            : undefined,
          contentDetails: {
            duration: item.contentDetails?.duration ?? '',
            dimension: item.contentDetails?.dimension ?? '',
            definition: item.contentDetails?.definition ?? '',
            caption: item.contentDetails?.caption ?? '',
            licensedContent: item.contentDetails?.licensedContent ?? false,
            contentRating: item.contentDetails?.contentRating ?? {},
            projection: item.contentDetails?.projection ?? '',
          },
          statistics: item.statistics
            ? {
                viewCount: item.statistics.viewCount,
                likeCount: String(item.statistics.likeCount),
                favoriteCount: String(item.statistics.favoriteCount),
                commentCount: String(item.statistics.commentCount),
              }
            : undefined,
        }));

      if (matchedItems.length > 0) {
        matchedResults.push({
          kind: result.kind ?? '',
          etag: result.etag ?? '',
          pageInfo: result.pageInfo,
          items: matchedItems,
        });
      }
    }

    return of(matchedResults);
  }

  public warmUp(): Observable<void> {
    const url = `${this.appConfig.backendUrl}/api/manual_warmup`;
    return this.http.get<any>(url);
  }


}
