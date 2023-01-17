do $$
declare
	nameVar varchar;
	cityName varchar;
	cityArr varchar[]:= '{Las Vegas, Cincinnati, Baltimore, Pittsburgh, Nashville, Houston, Philadelphia, Dallas, Washington D.C., San Francisco, Seattle, Phoenix, Detroit, Green Bay, Chicago, Tampa, Charlotte, New Orleans, Atlanta}';
begin
	foreach cityName in array cityArr
	loop
		select name into nameVar
		from city
		where name=cityName;

		if nameVar is null then
			insert into city (name) values (cityName);
			raise notice '%', cityName;
		end if;
	end loop;
end $$;