import { Header } from "@/components/shared/Header";
import { ServiceForm } from "@/components/shared/ServiceForm";

const GenerativeFill = () => {
  return (
    <>
      <Header
        title="Generative Fill"
        subTitle="Enhance an image's dimensions using AI outpainting."
      />

      <section className="mt-14">
        <ServiceForm type="Fill Image" config={{ fillBackground: true }} />
      </section>
    </>
  );
};

export default GenerativeFill;
