export type ComponentCategory = "cpu" | "gpu" | "motherboard" | "ram" | "storage" | "psu" | "case" | "cooler";
export type Brand = "amd" | "intel" | "nvidia" | "corsair" | "asrock" | "msi" | "seasonic" | "fractal" | "deepcool" | "samsung" | "kingston";
export type ProductOffer = { id: string; store: string; url?: string; price: number; currency: "EUR"; shipping?: number; availability: "demo" | "in_stock" | "out_of_stock"; source: string; updatedAt: string; verified: boolean };
export type ComponentProduct = {
  id: string; category: ComponentCategory; brand: Brand; name: string; price: number; icon: string; shortSpec: string;
  socket?: string; ramType?: "DDR4" | "DDR5"; chipset?: string; formFactor?: "ATX" | "mATX"; gpuLength?: number;
  coolerHeight?: number; psuWattage?: number; tdp?: number; requiredWattage?: number; wifi?: boolean; rgb?: boolean;
  reliability: "demo"; source: "catalogo locale dimostrativo";
  model?: string; currency?: "EUR"; availability?: "demo" | "in_stock" | "out_of_stock"; updatedAt?: string; offers?: ProductOffer[];
};
const demo = { reliability: "demo" as const, source: "catalogo locale dimostrativo" as const };
export const catalog: ComponentProduct[] = [
  { ...demo, id:"cpu-7600",category:"cpu",brand:"amd",name:"AMD Ryzen 5 7600",price:199,icon:"◈",shortSpec:"6 core · 3.8 GHz · AM5 · 65 W",socket:"AM5",ramType:"DDR5",tdp:65 },
  { ...demo, id:"cpu-7700",category:"cpu",brand:"amd",name:"AMD Ryzen 7 7700",price:289,icon:"◈",shortSpec:"8 core · 3.8 GHz · AM5 · 65 W",socket:"AM5",ramType:"DDR5",tdp:65 },
  { ...demo, id:"cpu-14600k",category:"cpu",brand:"intel",name:"Intel Core i5-14600K",price:299,icon:"◈",shortSpec:"14 core · 5.3 GHz · LGA1700 · 125 W",socket:"LGA1700",ramType:"DDR5",tdp:125 },
  { ...demo, id:"gpu-4060",category:"gpu",brand:"nvidia",name:"GeForce RTX 4060 8GB",price:319,icon:"▰",shortSpec:"8 GB GDDR6 · 115 W · 242 mm",gpuLength:242,requiredWattage:450 },
  { ...demo, id:"gpu-4070s",category:"gpu",brand:"nvidia",name:"GeForce RTX 4070 SUPER 12GB",price:649,icon:"▰",shortSpec:"12 GB GDDR6X · 220 W · 244 mm",gpuLength:244,requiredWattage:650 },
  { ...demo, id:"gpu-7800xt",category:"gpu",brand:"amd",name:"Radeon RX 7800 XT 16GB",price:529,icon:"▰",shortSpec:"16 GB GDDR6 · 263 W · 302 mm",gpuLength:302,requiredWattage:700 },
  { ...demo, id:"mb-b650",category:"motherboard",brand:"asrock",name:"ASRock B650M Pro RS WiFi",price:159,icon:"▦",shortSpec:"AM5 · B650 · mATX · Wi-Fi 6E",socket:"AM5",ramType:"DDR5",chipset:"B650",formFactor:"mATX",wifi:true },
  { ...demo, id:"mb-b760",category:"motherboard",brand:"msi",name:"MSI PRO B760-P WiFi",price:169,icon:"▦",shortSpec:"LGA1700 · B760 · ATX · Wi-Fi 6E",socket:"LGA1700",ramType:"DDR5",chipset:"B760",formFactor:"ATX",wifi:true },
  { ...demo, id:"ram-32",category:"ram",brand:"corsair",name:"Corsair Vengeance 32GB",price:99,icon:"▤",shortSpec:"2×16 GB · DDR5-6000 · CL36",ramType:"DDR5" },
  { ...demo, id:"ram-64",category:"ram",brand:"kingston",name:"Kingston Fury 64GB",price:189,icon:"▤",shortSpec:"2×32 GB · DDR5-6000 · CL36",ramType:"DDR5" },
  { ...demo, id:"ssd-1tb",category:"storage",brand:"kingston",name:"Kingston KC3000 1TB",price:79,icon:"▱",shortSpec:"NVMe PCIe 4.0 · 7.000 MB/s" },
  { ...demo, id:"ssd-2tb",category:"storage",brand:"samsung",name:"Samsung 990 EVO 2TB",price:139,icon:"▱",shortSpec:"NVMe PCIe 4.0 · 5.000 MB/s" },
  { ...demo, id:"psu-650",category:"psu",brand:"seasonic",name:"Seasonic Focus GX 650W",price:99,icon:"⎔",shortSpec:"650 W · 80+ Gold · ATX",psuWattage:650 },
  { ...demo, id:"psu-750",category:"psu",brand:"seasonic",name:"Seasonic Focus GX 750W",price:119,icon:"⎔",shortSpec:"750 W · 80+ Gold · ATX",psuWattage:750 },
  { ...demo, id:"case-meshify",category:"case",brand:"fractal",name:"Fractal Pop Air",price:89,icon:"▣",shortSpec:"Mid tower · ATX · GPU 405 mm",formFactor:"ATX",gpuLength:405 },
  { ...demo, id:"case-compact",category:"case",brand:"fractal",name:"Fractal Pop Mini Air",price:89,icon:"▣",shortSpec:"Compact · mATX · GPU 365 mm",formFactor:"mATX",gpuLength:365 },
  { ...demo, id:"cooler-ak400",category:"cooler",brand:"deepcool",name:"DeepCool AK400",price:39,icon:"≋",shortSpec:"Torre · 155 mm · 220 W",coolerHeight:155 },
  { ...demo, id:"cooler-ak620",category:"cooler",brand:"deepcool",name:"DeepCool AK620",price:59,icon:"≋",shortSpec:"Doppia torre · 160 mm · 260 W",coolerHeight:160 },
];
