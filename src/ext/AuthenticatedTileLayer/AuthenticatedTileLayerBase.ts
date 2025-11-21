import Axios from 'axios';
import {
  Coords,
  DoneCallback,
  TileLayerOptions as LeafletTileLayerOptions,
  TileLayer,
} from 'leaflet';

export type AuthenticatedTileLayerBaseOptions = LeafletTileLayerOptions & {
  getAccessToken: () => Promise<string>;
  url: string;
};

/**
 * AuthenticatedTileLayerBase extends the Leaflet TileLayer to support
 * authenticated tile requests.
 */
export class AuthenticatedTileLayerBase extends TileLayer {
  private getAccessToken: () => Promise<string>;

  constructor(urlTemplate: string, options: AuthenticatedTileLayerBaseOptions) {
    super(urlTemplate, options);
    this.getAccessToken = options.getAccessToken;
  }

  /**
   * Creates a tile by requesting it with an authenticated call.
   * Retrieves an access token, fetches the tile as a blob, and assigns
   * the resulting object URL to the image element before returning it.
   */
  createTile(coords: Coords, done: DoneCallback) {
    const imgEl = document.createElement('img');
    const url = this.getTileUrl(coords);

    // getAccessToken will resolve immediately
    this.getAccessToken()
      .then((accessToken) =>
        Axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'blob',
        }),
      )
      .then((res) => {
        const blob = new Blob([res.data], {
          type: res.headers['content-type']?.toString(),
        });
        imgEl.src = URL.createObjectURL(blob);
        done(undefined, imgEl);
      })
      .catch((err) => done(err, undefined));

    return imgEl;
  }
}
