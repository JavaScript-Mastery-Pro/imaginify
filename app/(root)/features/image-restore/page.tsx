import { Header } from "@/components/shared/Header";
import { ServiceForm } from "@/components/shared/ServiceForm";

const ImageRestore = () => {
  return (
    <>
      <Header
        title="Image Restore"
        subTitle="Refine images by removing noise and imperfections"
      />
      <section className="mt-14">
        <ServiceForm type="Restore Image" config={{ restore: true }} />
      </section>
    </>
  );
};

export default ImageRestore;
