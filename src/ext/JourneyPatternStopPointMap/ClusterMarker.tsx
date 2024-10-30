import { Marker, useMap } from 'react-leaflet';
import { getClusterIcon } from './markers';

interface ClusterMarkerProps {
  longitude: number;
  latitude: number;
  clusterId: string | number | undefined;
  pointCount: number;
  totalPointCount: number;
}

const ClusterMarker = ({
  longitude,
  latitude,
  clusterId,
  pointCount,
  totalPointCount,
}: ClusterMarkerProps) => {
  const map = useMap();

  return (
    <Marker
      key={`cluster-${clusterId}`}
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
