#ifndef _NODE_DEF_H_
#define _NODE_DEF_H_

#include <node.h>
#include <node_version.h>
#include <v8.h>
#include "nan.h"

/*****************************************
 * type convert
*****************************************/
#define _S(a) NanSymbol(a)
#define A2O(a) v8::String::New(a)
#define O2A(o) (*v8::String::AsciiValue(o))
#define S2O(s) v8::String::New(s.c_str())
#define O2S(o) (*v8::String::AsciiValue(o)) //must do as std::string str = O2S(o);
#define B2O(i) v8::Boolean::New(i)
#define O2B(o) (o)->BooleanValue()
#define N2O(i) v8::Number::New(i)
#define O2N(o) (o)->NumberValue()
#define I2O(i) v8::Int32::New(i)
#define O2I(o) (o)->Int32Value()
#define O2INT64(o) (o)->IntegerValue()
#define INT642O(i) v8::Number::New(static_cast<double>(i))
#define O2INT32(o) (o)->Int32Value()
#define UINT322O(i) v8::Uint32::New(i)
#define O2UINT32(o) (o)->Uint32Value()

/*****************************************
 * define log
*****************************************/
#define JSLOG(x) do { \
	Handle<Object> global = Context::GetCurrent()->Global(); \
	Handle<Value> handle = global->Get(String::New("console")); \
	Handle<Object> console = Handle<Object>::Cast(handle); \
	handle = console->Get(String::New("log")); \
	Handle<Function> log = Handle<Function>::Cast(handle); \
	Handle<Value> args[] = { String::New(x) }; \
	log->Call(global, 1, args); \
} while (0)

/*****************************************
* declare default for native class
*****************************************/
#define DEFAULT_NATIVE_CLASS_PROPERTY() \
	public: \
		void SetV8Handle(v8::Persistent<v8::Object> _handle) {handle = _handle;} \
		v8::Persistent<v8::Object> GetV8Handle() {return handle;} \
	private: \
		v8::Persistent<v8::Object> handle

/*****************************************
 * inherit
*****************************************/
#define INHERIT(Super) \
    constructor->Inherit (Super::constructor)

/*****************************************
 * declare Object class
*****************************************/
#define DECLARE_OBJECT_CLASS_BEGIN(ClassName) \
	class ClassName { \
		public:\
			static void Init (Handle<Object> target);\
			static NAN_METHOD(New); \
			static v8::Persistent<v8::FunctionTemplate> constructor;

#define DECLARE_OBJECT_CLASS_END(ClassName) \
	}; \
	v8::Persistent<v8::FunctionTemplate> ClassName::constructor;


/*****************************************
 * define ObjectWrap class
*****************************************/
#define DEFINE_OBJECT_CLASS_BEGIN(ClassName) \
	void ClassName::Init(Handle<Object> target) { \
		NanAssignPersistent(FunctionTemplate, constructor, FunctionTemplate::New(New)); \
		constructor->SetClassName(NanSymbol(#ClassName)); \
		constructor->InstanceTemplate()->SetInternalFieldCount(1); 
		
#define DEFINE_OBJECT_CLASS_END(ClassName) \
            target->Set(NanSymbol(#ClassName), constructor->GetFunction()); \
	}

/*****************************************
 * class constructor
*****************************************/
#define CONSTRUCT_OBJECT_CLASS_BEGIN(ClassName) \
	NAN_METHOD(ClassName::New) { \
		NanScope(); \
		Native##ClassName *nativeobj = new Native##ClassName(); \
		NanInitPersistent(Object, self, args.This()); \
		nativeobj->SetV8Handle(self); \
		NanSetInternalFieldPointer(self, 0, nativeobj);

#define CONSTRUCT_OBJECT_CLASS_END() \
		NanReturnValue(args.This()); \
	}

/*****************************************
 * class method
*****************************************/
#define DECLARE_CLASS_FUNCTION(Method) \
	static NAN_METHOD(Method)

#define DEFINE_CLASS_FUNCTION(Method) \
	v8::Local<v8::String> name_##Method = NanSymbol(#Method); \
	v8::Local<v8::Function> fn_##Method = v8::FunctionTemplate::New(Method)->GetFunction(); \
	fn_##Method->SetName(name_##Method); \
	constructor->Set(name_##Method, fn_##Method)

#define IMPL_CLASS_METHOD_BEGIN(ClassName, Method) \
	NAN_METHOD(ClassName::Method) { \
		NanScope();

#define IMPL_CLASS_METHOD_END(ReturnValue) \
		NanReturnValue(ReturnValue); \
	}

/*****************************************
 * prototype method
*****************************************/
#define DECLARE_PROTOTYPE_METHOD(Method) \
	static NAN_METHOD(Method)

#define DEFINE_PROTOTYPE_METHOD(Method) \
	NODE_SET_PROTOTYPE_METHOD (constructor, #Method, Method)
	
#define IMPL_PROTOTYPE_METHOD_BEGIN(ClassName, Method) \
	NAN_METHOD(ClassName::Method) { \
		NanScope(); \
		Native##ClassName * nativeobj = (Native##ClassName*)NanGetInternalFieldPointer(args.This(), 0);

#define IMPL_PROTOTYPE_METHOD_END(ReturnValue) \
		NanReturnValue(ReturnValue); \
	}

/*****************************************
 * property accessor
*****************************************/
#define DECLARE_ACCESSABLE_PROPERTY(Property) \
	static NAN_GETTER(Get##Property); \
	static NAN_SETTER(Set##Property)

#define DEFINE_ACCESSABLE_PROPERTY(Property) \
	constructor->InstanceTemplate()->SetAccessor(NanSymbol(#Property), Get##Property, Set##Property)
	
/*****************************************
 * readonly property accessor
*****************************************/
#define DECLARE_READONLY_PROPERTY(Property) \
	static NAN_GETTER(Get##Property); 

#define DEFINE_READONLY_PROPERTY(Property) \
	constructor->InstanceTemplate()->SetAccessor(NanSymbol(#Property), Get##Property)

#define IMPL_READONLY_PROPERTY(ClassName, V8Type, Property) \
	NAN_GETTER(ClassName::Get##Property) { \
		NanScope(); \
		Native##ClassName *nativeobj = (Native##ClassName*)NanGetInternalFieldPointer(args.This(), 0); \
		NanReturnValue(v8::V8Type::New(nativeobj->Get##Property())); \
	} 

#define IMPL_ACCESSABLE_PROPERTY(ClassName, V8Type, V8TypeToCtype, Property) \
	IMPL_READONLY_PROPERTY(ClassName, V8Type, Property) \
	NAN_SETTER(ClassName::Set##Property) { \
		NanScope(); \
		Native##ClassName *nativeobj = (Native##ClassName*)NanGetInternalFieldPointer(args.This(), 0); \
		nativeobj->Set##Property(V8TypeToCtype(value)); \
	}

/*****************************************
 *define class enum
*****************************************/
#define DEFINE_CLASS_ENUM(enum) \
	constructor->Set(NanSymbol(#enum), Integer::New(enum), ReadOnly)
		
/*****************************************
 *define enum
*****************************************/
#define DEFINE_ENUM(enum) \
	self->Set(NanSymbol(#enum), Integer::New(enum), ReadOnly)

/*****************************************
 *module exports
*****************************************/
#define EXPORTS_MODULE_BEGIN(module) \
    void init(Handle<Object> target) {

#define EXPORTS_MODULE_END(module) \
    } \
    NODE_MODULE(module, init)

/*****************************************
 *error assert
*****************************************/
#define NODE_ERROR(str) \
	ThrowException(Exception::Error(v8::String::New(str)))
#define THROW_BAD_ARGUMENTS() \
	ThrowException(Exception::TypeError(v8::String::New("Bad argument")))

#endif /* end of _NODE_DEF_H_ */
