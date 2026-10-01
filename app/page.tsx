import Hero from "@/src/components/Hero";
import SiteLayout from "@/src/components/SiteLayout";
import { Tabs } from "@/src/components/Tabs";
import CraftsPanel from "@/src/components/craft/CraftsPanel";
import ClassesPanel from "@/src/components/classes/ClassesPanel";

export default function Home() {
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Hero />
        <div className="mt-10">
          <Tabs
            tabs={[
              {
                id: "products",
                label: "공예품 전시·주문",
                panel: <CraftsPanel />,
              },
              {
                id: "classes",
                label: "공방 클래스",
                panel: <ClassesPanel />,
              },
            ]}
          />
        </div>
      </div>
    </SiteLayout>
  );
}
