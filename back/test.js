function a() {
  try {
    return 1;
  } catch {
  } finally {
    console.log(122);
  }
}

a();
