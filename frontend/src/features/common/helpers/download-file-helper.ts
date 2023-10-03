import { Base64 } from "js-base64";

export const downloadFile = async (apiUrl: string, fileName?: string) => {
    const file = await fetch(apiUrl,
    {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const fileBlob = await file.blob();
    const url = URL.createObjectURL(fileBlob);

    const anchor = document.createElement("a");
    anchor.style.display = "none";
    anchor.target = '_blank';
    anchor.href = url;
    anchor.download = !!fileName ? fileName : Base64.decode(file.headers.get("FileName") as string);

    anchor.addEventListener("click", function(e) {
        e.stopPropagation();   
    }, { once: true });

    document.body.appendChild(anchor);

    setTimeout(function(){
        anchor.click();
        setTimeout(function(){
            URL.revokeObjectURL(url);
            document.body.removeChild(anchor);
        }, 250);
    }, 66);
}