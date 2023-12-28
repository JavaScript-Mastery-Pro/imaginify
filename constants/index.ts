export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "AI Features",
    route: "/features",
    nested: [
      {
        label: "Image Restore",
        route: "/features/image-restore",
        icon: "/assets/icons/image.svg",
      },
      {
        label: "Generative Fill",
        route: "/features/generative-fill",
        icon: "/assets/icons/stars.svg",
      },
      {
        label: "Object Remove",
        route: "/features/object-remove",
        icon: "/assets/icons/scan.svg",
      },
      {
        label: "Image Recolor",
        route: "/features/image-recolor",
        icon: "/assets/icons/camera.svg",
      },
    ],
  },

  {
    label: "Profile",
    route: "/profile",
  },
  {
    label: "Buy Credits",
    route: "/credits",
  },
];

export const plans = [
  {
    _id: 1,
    name: "Free plan",
    icon: "/assets/icons/free-plan.svg",
    price: 0,
    credits: 10,
    inclusions: [
      {
        label: "10 Free Credits",
        isIncluded: true,
      },
      {
        label: "Basic Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: false,
      },
      {
        label: "Priority Updates",
        isIncluded: false,
      },
    ],
  },
  {
    _id: 2,
    name: "Pro plan",
    icon: "/assets/icons/free-plan.svg",
    price: 40,
    credits: 220,
    inclusions: [
      {
        label: "120 Credits",
        isIncluded: true,
      },
      {
        label: "Full Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: true,
      },
      {
        label: "Priority Updates",
        isIncluded: false,
      },
    ],
  },
  {
    _id: 3,
    name: "Premium plan",
    icon: "/assets/icons/free-plan.svg",
    price: 199,
    credits: 2000,
    inclusions: [
      {
        label: "2000 Credits",
        isIncluded: true,
      },
      {
        label: "Full Access to Services",
        isIncluded: true,
      },
      {
        label: "Priority Customer Support",
        isIncluded: true,
      },
      {
        label: "Priority Updates",
        isIncluded: true,
      },
    ],
  },
];

export const serviceInitialValues = {
  title: "",
  imageUrl: "",
  transformedImageUrl: "",
  serviceType: "",
  aspectRatio: "",
  targetObject: "",
  prompt: "",
};
