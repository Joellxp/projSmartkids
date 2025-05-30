import Input from "../base/Input"; // já está correto

// ...
<form onSubmit={handleUpload} style={{ marginBottom: "16px" }}>
  <Input
    type="file"
    accept="application/pdf"
    onChange={handleFileChange}
    style={{ marginRight: "8px" }}
  />
  <Button type="submit" disabled={loading}>
    {loading ? <Loader /> : "Enviar PDF"}
  </Button>
</form>