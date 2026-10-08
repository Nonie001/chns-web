import type { RegionalCenter } from "@/content/static/organization";
import { projectToThailandMap, thailandMap } from "@/content/static/thailand-map";

const mapX = 390;
const mapY = 24;
const mapScale = 0.94;

// Place labels around the outline so the leader lines remain readable.
const labelPositions = [
  { side: "left", y: 105 },
  { side: "right", y: 145 },
  { side: "right", y: 245 },
  { side: "left", y: 225 },
  { side: "left", y: 385 },
  { side: "left", y: 610 },
  { side: "right", y: 345 },
  { side: "right", y: 465 },
  { side: "right", y: 590 },
  { side: "left", y: 715 },
  { side: "right", y: 735 },
] as const;

export function RegionalCenterMap({ centers }: { centers: readonly RegionalCenter[] }) {
  if (centers.length === 0) return <p className="content-empty">ยังไม่มีข้อมูลศูนย์ประสานงาน</p>;

  const points = centers.map((center, index) => {
    const point = projectToThailandMap(center.latitude, center.longitude);
    return {
      center,
      index,
      mapPoint: point,
      x: mapX + point.x * mapScale,
      y: mapY + point.y * mapScale,
      label: labelPositions[index],
    };
  });

  return (
    <figure className="center-map">
      <svg className="center-map__desktop" viewBox="0 0 1200 800" role="img" aria-labelledby="center-map-title center-map-description">
        <title id="center-map-title">{`แผนที่ศูนย์ประสานงานระดับภูมิภาค ${centers.length} แห่ง`}</title>
        <desc id="center-map-description">{centers.map((center) => `${center.name}: ${center.location}${center.note ? ` (${center.note})` : ""}`).join("; ")}</desc>
        <defs>
          <linearGradient id="center-map-land" x1="0" y1="0" x2="60%" y2="100%">
            <stop offset="0%" stopColor="#eaf4e9" />
            <stop offset="100%" stopColor="#d5e8d5" />
          </linearGradient>
        </defs>
        <g className="center-map__land" transform={`translate(${mapX} ${mapY}) scale(${mapScale})`}>
          <path d={thailandMap.mainland} />
          {thailandMap.islands.map((island) => <path d={island} key={island} />)}
        </g>
        {points.map(({ center, index, x, y, label }) => {
          if (!label) return null;
          const left = label.side === "left";
          const labelX = left ? 352 : 848;
          const textX = left ? 326 : 874;
          const bend = left ? -62 : 62;
          return (
            <g className="center-map__callout" key={center.name}>
              <path className="center-map__leader" d={`M ${x.toFixed(1)} ${y.toFixed(1)} C ${(x + bend).toFixed(1)} ${y.toFixed(1)}, ${(labelX - bend).toFixed(1)} ${label.y}, ${labelX} ${label.y}`} />
              <circle className="center-map__label-dot" cx={labelX} cy={label.y} r="14" />
              <text className="center-map__label-number" x={labelX} y={label.y + 5} textAnchor="middle">{index + 1}</text>
              <text className="center-map__label-name" x={textX} y={label.y - 5} textAnchor={left ? "end" : "start"}>{center.name}</text>
              <text className="center-map__label-location" x={textX} y={label.y + 15} textAnchor={left ? "end" : "start"}>{center.location}</text>
              {center.note && <text className="center-map__label-note" x={textX} y={label.y + 32} textAnchor={left ? "end" : "start"}>{center.note}</text>}
            </g>
          );
        })}
        {points.map(({ center, index, x, y }) => (
          <g className="center-map__marker" key={center.name}>
            <circle className="center-map__marker-halo" cx={x} cy={y} r="16" />
            <circle className="center-map__marker-core" cx={x} cy={y} r="11" />
            <text x={x} y={y + 4} textAnchor="middle">{index + 1}</text>
          </g>
        ))}
      </svg>

      <svg className="center-map__mobile" viewBox={`-20 -16 ${thailandMap.width + 40} ${thailandMap.height + 32}`} role="img" aria-label={`แผนที่ประเทศไทยแสดงที่ตั้งศูนย์ประสานงาน ${centers.length} แห่ง`}>
        <g className="center-map__land">
          <path d={thailandMap.mainland} />
          {thailandMap.islands.map((island) => <path d={island} key={island} />)}
        </g>
        {points.map(({ center, index, mapPoint }) => (
          <g className="center-map__marker" key={center.name}>
            <circle className="center-map__marker-halo" cx={mapPoint.x} cy={mapPoint.y} r="17" />
            <circle className="center-map__marker-core" cx={mapPoint.x} cy={mapPoint.y} r="12" />
            <text x={mapPoint.x} y={mapPoint.y + 4} textAnchor="middle">{index + 1}</text>
          </g>
        ))}
      </svg>

      <figcaption className="center-map__caption">ตำแหน่งหมุดแสดงอำเภอที่ตั้งศูนย์โดยประมาณ · เส้นขอบแผนที่จาก Natural Earth</figcaption>
      <ol className="center-map__mobile-list">
        {points.map(({ center, index }) => (
          <li key={center.name}>
            <span className="center-map__mobile-number">{index + 1}</span>
            <span><strong>{center.name}</strong><span>{center.location}</span>{center.note && <small>{center.note}</small>}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
