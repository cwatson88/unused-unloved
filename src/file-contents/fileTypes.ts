interface InterfaceFileType {
  formatExtensions: string[];
  type: string;
}

const fileTypes: InterfaceFileType[] = [
  {
    formatExtensions: [
      ".ai",
      ".bmp",
      ".gif",
      ".ico",
      ".jpeg",
      ".png",
      ".ps",
      ".psd",
      ".svg",
      ".tif"
    ],
    type: "img"
  },
  {
    formatExtensions: [".eot", ".ttf", ".woff"],
    type: "font"
  },
  {
    formatExtensions: [".css", ".scss", ".less"],
    type: "styles"
  },
  {
    formatExtensions: [".js"],
    type: "javascript"
  },
  {
    formatExtensions: [".ts"],
    type: "typescript"
  },
  {
    formatExtensions: [".jsx", ".tsx"],
    type: "react"
  }
];

export { fileTypes };
