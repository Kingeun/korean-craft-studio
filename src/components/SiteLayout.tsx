import Footer from "@/src/components/Footer";
import Header from "@/src/components/Header";
import PracticeNotice from "@/src/components/PracticeNotice";

type SiteLayoutProps = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <Header />
      <PracticeNotice variant="banner" />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
