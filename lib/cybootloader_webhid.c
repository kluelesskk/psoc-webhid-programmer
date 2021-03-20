#include "cybootloaderutils/cybtldr_api.h"
#include "cybootloaderutils/cybtldr_api2.h"

#include <emscripten.h>

EM_JS(int, WebHidOpenConnection, (), {
    return Asyncify.handleAsync(async () => {
        try {
            await Module.activeDevice._open();
            return 0;
        } catch (ex) {
            Module.activeDevice._message(`HID open failed: ${ex.message}`);
            return 1;
        }
    });
});

EM_JS(int, WebHidCloseConnection, (), {
    return Asyncify.handleAsync(async () => {
        try {
            await Module.activeDevice._close();
            return 0;
        } catch (ex) {
            Module.activeDevice._message(`HID close failed: ${ex.message}`);
            return 1;
        }
    });
});

EM_JS(int, WebHidReadData, (unsigned char* bufPtr, int bufSize), {
    return Asyncify.handleAsync(async () => {
        try {
            let buf = await Module.activeDevice._read();
            //console.log('Read', buf);
            Module.HEAPU8.set(buf.subarray(0, bufSize), bufPtr);
            return 0;
        } catch (ex) {
            Module.activeDevice._message(`HID read failed: ${ex.message}`);
            return 1;
        }
    });
});

EM_JS(int, WebHidWriteData, (unsigned char* bufPtr, int bufSize), {
    return Asyncify.handleAsync(async () => {
        try {
            let buf = Module.HEAPU8.subarray(bufPtr, bufPtr + bufSize);
            //console.log('Write', buf);
            await Module.activeDevice._write(buf);
            return 0;
        } catch (ex) {
            Module.activeDevice._message(`HID write failed: ${ex.message}`);
            return 1;
        }
    });
});

EM_JS(void, WebHidProgressUpdate, (unsigned char arrayId, unsigned short rowNum), {
    Module.activeDevice._message(`HID write progress: array ${arrayId} row ${rowNum}`);
});

static CyBtldr_CommunicationsData s_WebHidComms = {
    WebHidOpenConnection, WebHidCloseConnection, WebHidReadData, WebHidWriteData, 64};

int Cybootloader_WebHidProgram(const char* file)
{
    return CyBtldr_Program(file, 0, 1, &s_WebHidComms, &WebHidProgressUpdate);
}

int Cybootloader_WebHidVerify(const char* file)
{
    return CyBtldr_Verify(file, 0, &s_WebHidComms, &WebHidProgressUpdate);
}

int Cybootloader_WebHidErase(const char* file)
{
    return CyBtldr_Erase(file, 0, &s_WebHidComms, &WebHidProgressUpdate);
}
