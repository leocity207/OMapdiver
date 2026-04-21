#include "line.h"
#include <oatpp/json/ObjectMapper.hpp>

oatpp::Object<O::DTO::Line> O::DTO::Line::From_Postgres(
    const oatpp::Object<O::DTO::Postgres_Line>& src,
    const std::shared_ptr<oatpp::json::ObjectMapper>& jsonMapper
) {
    if (!src) {
        return nullptr;
    }

    auto line = Line::createShared();

    // Base fields
    line->id = src->id;
    line->label = src->label;

    // Direct mappings
    line->url = src->url;
    line->icon = src->icon;
    line->stations = src->stations;

    // Initialize collections (important to avoid null later)
    line->patterns = oatpp::List<oatpp::Object<Pattern>>::createShared();
    line->timetables = oatpp::List<oatpp::Object<Service_Mission>>::createShared();
    line->info_messages = oatpp::List<oatpp::Object<Info_Message>>::createShared();

    // JSONB → Fields<String>
    line->color = oatpp::Fields<oatpp::String>::createShared();

    if (src->color) {
        try {
            line->color = jsonMapper->readFromString<oatpp::Fields<oatpp::String>>(src->color);
        } catch (const std::exception&) {
            // fallback: keep empty object (never crash endpoint)
            line->color = oatpp::Fields<oatpp::String>::createShared();
        }
    }

    return line;
}