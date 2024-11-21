import { Marker, useMap } from 'react-leaflet';
import { getClusterIcon } from './markers';

interface ClusterMarkerProps {
  longitude: number;
  latitude: number;
  pointCount: number;
  totalPointCount: number;
}

const ClusterMarker = ({
  longitude,
  latitude,
  pointCount,
  totalPointCount,
}: ClusterMarkerProps) => {
  const map = useMap();

  return (
    <Marker
      position={[latitude, longitude]}
      eventHandlers={{
        click: (e) => {
          map.setView([latitude, longitude], map.getZoom() + 1);
        },
      }}
      icon={getClusterIcon(
        pointCount,
        10 + (pointCount / totalPointCount) * 50,
      )}
    />
  );
};

export default ClusterMarker;
