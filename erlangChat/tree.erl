-module(tree).
-export([print_tree/1]).

print_tree(Dir) ->
    print_tree(Dir, 0).

print_tree(Dir, Level) ->
    case file:list_dir(Dir) of
        {ok, Files} ->
            lists:foreach(
                fun(File) ->
                        FilePath = filename:join(Dir, File),
                        case filelib:is_dir(FilePath) of
                            true ->
                                io:format("~s~s~n", [lists:duplicate(Level, "  "), File]),
                                print_tree(FilePath, Level + 1);
                            false ->
                                io:format("~s~s~n", [lists:duplicate(Level, "  "), File])
                        end
                end,
                Files
            );
        {error, Reason} ->
            io:format("Error listing directory ~s: ~s~n", [Dir, Reason])
    end.
