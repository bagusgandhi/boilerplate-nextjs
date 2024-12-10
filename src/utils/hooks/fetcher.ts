export function downloadResponseFile({ res, filename, auto = true, headerName="content-disposition" }: any) {
  const url = window.URL.createObjectURL(new Blob([ auto ? res?.data : res]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download", auto ?
      res?.headers[headerName].replace('attachment; filename=', '')
      .replaceAll('"', '')
      .replaceAll('\'', '')
      : filename
  );
  document.body.appendChild(link);
  link.click();
}