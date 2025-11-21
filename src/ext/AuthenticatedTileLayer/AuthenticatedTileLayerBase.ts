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

export class AuthenticatedTileLayerBase extends TileLayer {
  private getAccessToken: () => Promise<string>;

  constructor(urlTemplate: string, options: AuthenticatedTileLayerBaseOptions) {
    super(urlTemplate, options);
    this.getAccessToken = options.getAccessToken;
  }

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
