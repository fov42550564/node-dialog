#include "node_def.h"

using namespace v8;

#ifdef _WIN32
#include <conio.h>
#else //_WIN32
#include <termios.h>  
#include <unistd.h>  
#include <stdio.h>  
int getch(void) {   
	struct termios tm, tm_old;  
	int fd = STDIN_FILENO, c;  
	if(tcgetattr(fd, &tm) < 0)  
		return -1;  
	tm_old = tm;  
	cfmakeraw(&tm);  
	if(tcsetattr(fd, TCSANOW, &tm) < 0)  
		return -1;  
	c = fgetc(stdin);  
	if(tcsetattr(fd, TCSANOW, &tm_old) < 0)  
		return -1;  
	return c;  
}  
#endif //_WIN32

class NativeFangUtils
{
	DEFAULT_NATIVE_CLASS_PROPERTY();
public:
	NativeFangUtils();
	~NativeFangUtils();
public:
	char* gets();
	int getchar();
private:
	char buf_[256];
};

NativeFangUtils::NativeFangUtils()
{
	memset(buf_, 0x00, 256);
}

NativeFangUtils::~NativeFangUtils()
{
}

char *NativeFangUtils::gets()
{
	int ch = 0;	
	int i = 0;
	while ((ch=::getchar())!='\n' && i < 255)
	{
		buf_[i++] = ch;	
	}
	buf_[i] = '\0';
	return buf_;
}

int NativeFangUtils::getchar()
{
	return ::getch(); 
}

DECLARE_OBJECT_CLASS_BEGIN(FangUtils)
	DECLARE_PROTOTYPE_METHOD(gets);
	DECLARE_PROTOTYPE_METHOD(getchar);
DECLARE_OBJECT_CLASS_END(FangUtils)

DEFINE_OBJECT_CLASS_BEGIN(FangUtils)
	DEFINE_PROTOTYPE_METHOD(gets);
	DEFINE_PROTOTYPE_METHOD(getchar);
DEFINE_OBJECT_CLASS_END(FangUtils)

	CONSTRUCT_OBJECT_CLASS_BEGIN(FangUtils)
CONSTRUCT_OBJECT_CLASS_END()

IMPL_PROTOTYPE_METHOD_BEGIN(FangUtils, gets)
	char *str = nativeobj->gets();
IMPL_PROTOTYPE_METHOD_END(A2O(str))

IMPL_PROTOTYPE_METHOD_BEGIN(FangUtils, getchar)
	int ch = nativeobj->getchar();
IMPL_PROTOTYPE_METHOD_END(I2O(ch))

EXPORTS_MODULE_BEGIN(FangUtils)
	FangUtils::Init(target);
EXPORTS_MODULE_END(FangUtils)
