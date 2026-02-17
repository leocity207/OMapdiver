#ifndef DTO_EXCPETION_H
#define DTO_EXCEPTION_H

namespace O::DTO
{
	struct Exception
	{
		enum Type
		{
			FILE_DOES_NOT_EXIST,
			JSON_PARSING_FAILED,
		};

		Type type;
	};
}
#endif // !DTO_EXCPETION_H
