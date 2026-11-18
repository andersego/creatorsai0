#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <dlfcn.h>
#include <stdarg.h>

static const char *A = "/usr/bin/xkbcomp";
static const char *B = "/tmp/vnc-root/usr/bin/xkbcomp";

int execve(const char *path, char *const argv[], char *const envp[]) {
    static int (*real)(const char*, char *const[], char *const[]) = NULL;
    if (!real) real = dlsym(RTLD_NEXT, "execve");
    if (strcmp(path, A) == 0) path = B;
    return real(path, argv, envp);
}
int execv(const char *path, char *const argv[]) {
    return execve(path, argv, __environ);
}
int execvp(const char *file, char *const argv[]) {
    static int (*real)(const char*, char *const[]) = NULL;
    if (!real) real = dlsym(RTLD_NEXT, "execvp");
    if (strcmp(file, A) == 0) file = B;
    return real(file, argv);
}
