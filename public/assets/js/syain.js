$(function() {
    const pickerOpts = {
        types: [{
            description: 'Texts(.txt)',
            accept: {
                'text/*': ['.txt']
            }
        }],
        multiple: false,
    }

    let fileReader = new FileReader();
    let start = 0;
    let end = 0;
    $("#load").click(async function() {

        [fileHandle] = await window.showOpenFilePicker(pickerOpts);

        $("#message").html("Loading...");
        start = performance.now(); //track start
        const file = await fileHandle.getFile();
        const fileContents = await file.text();
        console.log(fileContents);
        $("#log").val(fileContents);

        end = performance.now(); //track end
        const time = (end - start) | 0;
        $("#message").html("Data is successfully loaded in " + (time / 1000) + "s");
    });

    $("#save").click(async function() {
        let fileHandle = await window.showSaveFilePicker(pickerOpts);
        const writable = await fileHandle.createWritable();
        await writable.write($("#log").val());
        await writable.close();
    });

});