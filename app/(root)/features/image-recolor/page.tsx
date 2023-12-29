import { Header } from "@/components/shared/Header";
import { ServiceForm } from "@/components/shared/ServiceForm";

const ImageRecolor = () => {
  return (
    <>
      <Header
        title="Image Recolor"
        subTitle="Identify and eliminate objects from images."
      />
      <section className="mt-14">
        <ServiceForm type="Recolor Item" />
      </section>
    </>
  );
};

export default ImageRecolor;
