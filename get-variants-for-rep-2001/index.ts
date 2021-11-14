type Distros = (typeof distros)[number];
type Variants = (typeof variants)[number];

const DISTRO_HEADINGS: Record<Distros, string> = {
  "ardent": "Ardent Apalone (December 2017 - December 2018)",
  "bouncy": "Bouncy Bolson (June 2018 - June 2019)",
  "crystal": "Crystal Clemmys (December 2018 - December 2019)",
  "dashing": "Dashing Diademata (May 2019 - May 2021)",
  "eloquent": "Eloquent Elusor (November 2019 - November 2020)",
  "foxy": "Foxy Fitzroy (May 2020 - May 2023)",
  "galactic": "Galactic Geochelone (May 2021 - November 2022)",
  "master": "Rolling Ridley (June 2020 - Ongoing)",
};

const VARIANT_HEADINGS: Record<Variants, string> = {
  "ros_core": "ROS Core",
  "ros_base": "ROS Base",
  "desktop": "Desktop",
};

async function getPackagesFromVariantUrl(url: string) {
  const response = await fetch(url);
  const text = await response.text();
  return [...text.matchAll(/<exec_depend>(.*)<\/exec_depend>/g)]
    .map((m) => m[1])
    .filter((p) => !variants.includes(p as Variants))
    .sort();
}

function getRawPackageText(packages: string[], maxChars = 60) {
  let out = "";
  let chars = 0;
  for (const p of packages) {
    if (chars + p.length > maxChars) {
      out += "\n";
      chars = 0;
    }
    out += p + ", ";
    chars += p.length + 2;
  }
  return out.split("\n")
    .map((line) => line.trim())
    .join("\n")
    .slice(0, -1); // remove trailing comma
}

function formatPackageText(
  variant: variants,
  packages: string[],
  maxChars = 60,
) {
  const lines = getRawPackageText(packages, maxChars).split("\n");
  let out = "";
  out += `${VARIANT_HEADINGS[variant]}\n` +
    "^".repeat(VARIANT_HEADINGS[variant].length) + "\n\n";
  out += `::\n\n  - ${variant}:\n`;
  if (variant === "ros_base") {
    out += `      extends:  [ros_core]\n`;
  } else if (variant === "desktop") {
    out += `      extends:  [ros_base]\n`;
  }
  out += `      packages: [${lines[0]}\n`;
  for (const line of lines.slice(1)) {
    out += "                 " + line + "\n";
  }
  return out.slice(0, -1) + "]\n\n";
}

type variants = "ros_core" | "ros_base" | "desktop";

function getVariantUrl(distro: Distros, variant: Variants) {
  return `https://raw.githubusercontent.com/ros2/variants/${distro}/${variant}/package.xml`;
}

async function getRep2001Text(
  distros: readonly Distros[],
  variants: readonly Variants[],
  maxChars: number,
) {
  let out = "";
  for (const distro of distros) {
    out += `${DISTRO_HEADINGS[distro]}\n` +
      "-".repeat(DISTRO_HEADINGS[distro].length) + "\n\n";
    for (const variant of variants) {
      const url = getVariantUrl(distro, variant);
      const packages = await getPackagesFromVariantUrl(url);
      out += formatPackageText(variant, packages, maxChars) + "\n";
    }
  }
  return out.trim();
}

// the names of the distro branches in https://github.com/ros2/variants
const distros = [
  "ardent",
  "bouncy",
  "crystal",
  "dashing",
  "eloquent",
  "foxy",
  "galactic",
  "master",
] as const;

// the name of the variants shown in REP 2001
// (also the names of the folders in https://github.com/ros2/variants)
const variants = ["ros_core", "ros_base", "desktop"] as const;

const maxChars = 50;
const outFile = "rep2001.txt";
const text = await getRep2001Text(distros, variants, maxChars);
await Deno.writeTextFile(outFile, text);
console.log(`Wrote ${outFile}`);
