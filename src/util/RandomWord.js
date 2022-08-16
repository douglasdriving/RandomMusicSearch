export async function GetRandomWord() {
  const res = await fetch(`https://random-word-form.herokuapp.com/random/noun`,{method: "GET"})
  const word = await res.json();
  return word[0];
}

