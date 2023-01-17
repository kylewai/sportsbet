create function getCityId(cityName varchar)
	returns int
	language plpgsql
	as
$$
declare
	city_id int;
begin
	select id
	into city_id
	from city
	where name=cityName;
	
	return city_id;
end;
$$;