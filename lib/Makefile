CC=emcc
CFLAGS=-Wall -O3
EMFLAGS=\
	-s WASM=0 \
	-s ASYNCIFY=1 \
	-s ASYNCIFY_IMPORTS='["WebHidOpenConnection","WebHidCloseConnection","WebHidReadData","WebHidWriteData"]' \
	-s EXPORTED_FUNCTIONS='["_Cybootloader_WebHidProgram","_Cybootloader_WebHidVerify","_Cybootloader_WebHidErase"]' \
	-s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall"]' \

CYBTLDR_DIR=cybootloaderutils
CYBTLDR_OBJS=\
	$(CYBTLDR_DIR)/cybtldr_api.o \
	$(CYBTLDR_DIR)/cybtldr_api2.o \
	$(CYBTLDR_DIR)/cybtldr_command.o \
	$(CYBTLDR_DIR)/cybtldr_parse.o

OBJS=cybootloader_webhid.o $(CYBTLDR_OBJS)
LIB=cybtldr.js

$(LIB): $(OBJS)
	$(CC) $(CFLAGS) $(EMFLAGS) $(OBJS) -o $(LIB) \
		--memory-init-file 0 \
		--post-js cybootloader_interface.js

%.o: %.c
	$(CC) $(CFLAGS) -c -o $@ $<

clean:
	rm $(OBJS) $(LIB)

.PHONY: $(LIB)
