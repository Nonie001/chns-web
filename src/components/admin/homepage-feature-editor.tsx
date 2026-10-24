"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { saveHomepageFeaturesAction } from "@/features/homepage/actions";
import type { FeatureOption, FeatureSelection } from "@/features/homepage/feature-store";
import { projectSlots } from "@/features/homepage/slots";

type Props = {
  selection: FeatureSelection;
  articles: FeatureOption[];
  projects: FeatureOption[];
};

function projectAt(index: number, chosen: Array<string | null>, projects: FeatureOption[]) {
  const configured = chosen.map((id) => projects.find((item) => item.id === id) ?? null);
  const reserved = new Set(configured.filter((item): item is FeatureOption => Boolean(item)).map((item) => item.id));
  const remaining = projects.filter((item) => !reserved.has(item.id));
  const resolved = configured.map((item) => item ?? remaining.shift() ?? null);
  return resolved[index];
}

export function HomepageFeatureEditor({ selection, articles, projects }: Props) {
  const initial = projectSlots.map((slot) => selection[slot]);
  const [chosen, setChosen] = useState<Array<string | null>>(initial);
  const [articleId, setArticleId] = useState(selection.article_1 ?? "");
  const [active, setActive] = useState(0);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const changed = articleId !== (selection.article_1 ?? "") || chosen.some((id, index) => id !== initial[index]);
  const current = projects.find((project) => project.id === chosen[active]);
  const assignedCount = chosen.filter(Boolean).length;
  const uniqueCount = new Set(chosen.filter(Boolean)).size;

  const assign = (index: number, id: string | null) => setChosen((previous) => previous.map((value, position) => position === index ? id : value));
  const removeDuplicates = () => {
    const seen = new Set<string>();
    setChosen((previous) => previous.map((id) => {
      if (!id || seen.has(id)) return null;
      seen.add(id);
      return id;
    }));
  };
  const drop = (index: number, data: string) => {
    setDragOver(null);
    const [kind, value] = data.split(":");
    if (kind === "project" && projects.some((project) => project.id === value)) assign(index, value);
    if (kind === "slot") {
      const from = Number(value);
      if (!Number.isInteger(from) || from < 0 || from >= chosen.length) return;
      setChosen((previous) => {
        const next = [...previous];
        [next[from], next[index]] = [next[index], next[from]];
        return next;
      });
    }
    setActive(index);
  };

  const previewCard = (index: number, className: string) => {
    const item = projectAt(index, chosen, projects);
    return <div
      className={`${className}${active === index ? " homepage-preview__slot--active" : ""}${dragOver === index ? " homepage-preview__slot--over" : ""}`}
      key={projectSlots[index]}
      role="button"
      tabIndex={0}
      aria-label={`ช่อง ${index + 1}: ${item?.title ?? "ว่าง"}`}
      aria-pressed={active === index}
      draggable={Boolean(chosen[index])}
      onDragStart={(event) => event.dataTransfer.setData("text/plain", `slot:${index}`)}
      onDragOver={(event) => { event.preventDefault(); setDragOver(index); }}
      onDragLeave={() => setDragOver(null)}
      onDrop={(event) => { event.preventDefault(); drop(index, event.dataTransfer.getData("text/plain")); }}
      onClick={() => setActive(index)}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActive(index); } }}
    >
      {item?.imageSrc && <Image src={item.imageSrc} alt="" fill sizes="(max-width: 900px) 100vw, 30vw" unoptimized />}
      <span className="homepage-preview__number">{index + 1}</span>
      <strong>{item?.title ?? "ว่าง — เลือกโครงการ"}</strong>
      {chosen[index] && <span className="homepage-preview__handle" aria-hidden="true">⠿</span>}
    </div>;
  };

  return <div className="homepage-editor">
    <div className="homepage-editor__toolbar">
      <div><strong>จัดหน้าโครงการ</strong><p>ลากรายการจากคลังลงช่อง หรือเลือกช่องแล้วคลิกรายการ · ตั้งค่า {assignedCount} ช่องจาก {uniqueCount} โครงการ</p></div>
      <div className="homepage-editor__toolbar-actions">
        {changed && <span className="homepage-editor__unsaved">ยังไม่บันทึก</span>}
        <Link href="/" target="_blank" rel="noopener noreferrer">ดูหน้าเว็บ ↗</Link>
      </div>
    </div>
    <div className="homepage-editor__layout">
      <div className="homepage-editor__canvas">
        <div className="homepage-editor__canvas-title"><span>ตัวอย่างหน้าแรก</span><small>ตำแหน่งภาพใหญ่ · การ์ดขวา · แถวล่าง</small></div>
        <div className="homepage-preview">
          <div className="homepage-preview__top">
            {previewCard(0, "homepage-preview__slot homepage-preview__slot--lead")}
            <div className="homepage-preview__right">{[1, 2, 3, 4].map((index) => previewCard(index, "homepage-preview__slot homepage-preview__slot--mini"))}</div>
          </div>
          <div className="homepage-preview__bottom">{[5, 6, 7, 8, 9].map((index) => previewCard(index, "homepage-preview__slot homepage-preview__slot--small"))}</div>
        </div>
        <div className="homepage-editor__selected">
          <label htmlFor="selected-project">ช่อง {active + 1} · {active === 0 ? "ภาพใหญ่" : active <= 4 ? "การ์ดขวา" : "แถวล่าง"}</label>
          <select id="selected-project" value={chosen[active] ?? ""} onChange={(event) => assign(active, event.target.value || null)}>
            <option value="">อัตโนมัติ / เว้นว่าง</option>
            {projects.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}
          </select>
          <span>{current ? "กำหนดเอง" : "หากว่าง ระบบจะใช้โครงการอื่นที่เผยแพร่เมื่อมีรายการเพียงพอ"}</span>
        </div>
      </div>
      <aside className="homepage-editor__library">
        <div className="homepage-editor__library-head"><strong>คลังโครงการ</strong><span>{projects.length} รายการ</span></div>
        <p>เฉพาะโครงการที่เผยแพร่แล้ว · ใช้ซ้ำได้</p>
        <div className="homepage-editor__items">
          {projects.map((item) => <button
            className="homepage-editor__item"
            draggable
            key={item.id}
            type="button"
            onDragStart={(event) => event.dataTransfer.setData("text/plain", `project:${item.id}`)}
            onClick={() => assign(active, item.id)}
          >
            <span className="homepage-editor__item-image">{item.imageSrc && <Image src={item.imageSrc} alt="" fill sizes="80px" unoptimized />}</span>
            <span>{item.title}<small>คลิกเพื่อใส่ช่อง {active + 1}</small></span>
            <span aria-hidden="true">⠿</span>
          </button>)}
        </div>
        <div className="homepage-editor__library-tools">
          <button type="button" onClick={removeDuplicates}>ล้างช่องที่ซ้ำ</button>
          <button type="button" onClick={() => { setChosen(initial); setArticleId(selection.article_1 ?? ""); }}>ย้อนกลับค่าที่บันทึก</button>
        </div>
      </aside>
    </div>
    <form action={saveHomepageFeaturesAction} className="homepage-editor__save">
      <label>ข่าวหรือบทความเด่น
        <select name="article_1" value={articleId} onChange={(event) => setArticleId(event.target.value)}>
          <option value="">อัตโนมัติ: รายการล่าสุดที่เผยแพร่</option>
          {articles.map((article) => <option value={article.id} key={article.id}>{article.title}</option>)}
        </select>
      </label>
      {projectSlots.map((slot, index) => <input key={slot} type="hidden" name={slot} value={chosen[index] ?? ""} />)}
      <button className="button button--dark" type="submit" disabled={!changed}>บันทึกหน้าแรก</button>
    </form>
  </div>;
}
