export function getFullUrl(name: string | undefined): string {
  if (!name) {
    return "";
  }

  let nameExtention = name
    .replaceAll("'", "")
    .replaceAll(".", "")
    .replaceAll("(", "")
    .replaceAll(")", "")
    .replaceAll("&", "")
    .replaceAll("²", "")
    .replaceAll("/", "")
    .replaceAll("-", " ")
    .replaceAll("   ", " ")
    .replaceAll("  ", " ")
    .replaceAll("  ", " ")
    .replaceAll("  ", " ")
    .replaceAll("  ", " ")
    .toLowerCase()
    .replaceAll(" ", "-");
    return "https://www.test-aankoop.be/invest/beleggen/fondsen/" + nameExtention;
}
