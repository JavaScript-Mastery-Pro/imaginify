import { Header } from "@/components/shared/Header";
import { ServiceForm } from "@/components/shared/ServiceForm";

const ObjectRemove = () => {
  return (
    <>
      <Header
        title="Object Remove"
        subTitle="Identify and eliminate objects from images."
      />
      <section className="mt-14">
        <ServiceForm
          type="Remove Object"
          config={{
            remove: { prompt: "", removeShadow: true, multiple: true },
          }}
        />
      </section>
    </>
  );
};

export default ObjectRemove;
